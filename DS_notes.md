Frontend prototype: https://ds604.neocities.org/CoolestWebsiteOnTheInternet_02022024

#### notes:
prototype frontend, with the main sections: the viewer page, the artist upload page, and a music player. i made it in sort of the artist-oriented myspace style, where there might be the possibility of skinning the page with different themes, and users can put their own stuff on the page. there doesn't have to be too much for this, since frontend isn't really part of this class. but anyway, it might help to figure out what gets stored and delivered on the backend. the json list of songs would be the same regardless of the styling, but user customization might be an interesting issue, since it brings up issues like site security


<details><summary>basic json that i'm using for the site, to initialize the music player</summary>
<pre>
[
            {
                metaData: {
                    artist: "Method Man feat. Busta Rhymes",
                    title: "What's Happenin'",
                },
                url: "https://ds604.neocities.org/Public/sound/02%20What's%20Happenin%20(Feat%20Busta%20Rh.mp3"
            },
            {
                metaData: {
                    artist: "Fugees",
                    title: "Vocab",
                },
                url: "https://ds604.neocities.org/Public/sound/Vocab%20(Refugees%20Hip%20Hop%20Remix).mp3"
            },
            {
                metaData: {
                    artist: "Kid Koala",
                    title: "Third World Lover"
                },
                url: "https://ds604.neocities.org/Public/sound/NeverForgiveAction_2%20Third%20World%20Lover.mp3"
            }
]
</pre>
</details>


<details><summary>sample CloudFormation file:</summary>
AWSTemplateFormatVersion: 2010-09-09
Description: Lab template

# Lab VPC with 1 public subnet
# Role for EC2 instance to launch another instance
# Misconfigured web server for challenge

Parameters:

  AmazonLinuxAMIID:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2


  KeyName:
    Type: String
    Description: Keyname for the keypair

Resources:

###########
# VPC with Internet Gateway
###########

  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: Lab VPC

  IGW:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: Lab IGW

  VPCtoIGWConnection:
    Type: AWS::EC2::VPCGatewayAttachment
    DependsOn:
      - IGW
      - VPC
    Properties:
      InternetGatewayId: !Ref IGW
      VpcId: !Ref VPC

###########
# Public Route Table
###########

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    DependsOn: VPC
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: Public Route Table

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn:
      - PublicRouteTable
      - IGW
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref IGW
      RouteTableId: !Ref PublicRouteTable

###########
# Public Subnet
###########

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    DependsOn: VPC
    Properties:
      VpcId: !Ref VPC
      MapPublicIpOnLaunch: true
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: !Select
        - 0
        - !GetAZs
          Ref: AWS::Region
      Tags:
        - Key: Name
          Value: Public Subnet

  PublicRouteTableAssociation1:
    Type: AWS::EC2::SubnetRouteTableAssociation
    DependsOn:
      - PublicRouteTable
      - PublicSubnet1
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet1

###########
# IAM Role for Bastion
###########

  BastionInstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Path: /
      Roles: [!Ref BastionRole]
      InstanceProfileName: Bastion-Role

  BastionRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: Bastion-Role
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - ec2.amazonaws.com
            Action:
              - sts:AssumeRole
      Path: /
      Policies:
        - PolicyName: root
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action: ec2:*
                Resource: '*'
              - Effect: Allow
                Action: ssm:Get*
                Resource: '*'
              - Effect: Deny
                Action: ec2:RunInstances
                Resource: arn:aws:ec2:*:*:instance/*
                Condition:
                  StringNotEquals:
                    ec2:InstanceType:
                    - t2.micro
                    - t3.micro
              - Effect: Deny
                Action:
                  - ec2:*Spot*
                  - ec2:*ReservedInstances*
                Resource: "*"
              - Effect: Deny
                Action: ec2:StartInstances
                Resource: arn:aws:ec2:*:*:instance/*
                Condition:
                  StringNotEquals:
                    ec2:InstanceType:
                    - t2.micro
                    - t3.micro

###########
# Security Group for Web Server launched by student
###########

  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: WebSecurityGroup
      GroupDescription: Enable HTTP and SSH ingress
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: Web Server Security Group

###########
# Misconfigured Instance for Challenge
###########

  MisconfiguredWebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
      ImageId: !Ref AmazonLinuxAMIID
      SubnetId: !Ref PublicSubnet1
      SecurityGroupIds:
        - !Ref MisconfiguredSecurityGroup
      KeyName: !Ref KeyName
      Tags:
        - Key: Name
          Value: Misconfigured Web Server
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          yum install -y httpd php
          /usr/bin/systemctl enable httpd
          /usr/bin/systemctl start httpdd 2>/tmp/errors.txt

  MisconfiguredSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: Challenge-SG
      GroupDescription: Enable SSH ingress
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: HTTP and SSH Security Group

Outputs:

  WebSecurityGroup:
    Value: !Sub ${WebServerSecurityGroup}
    Description: Web Security Group

  PublicSubnet:
    Value: !Sub ${PublicSubnet1}
    Description: Public Subnet

  MisconfiguredWebServer:
    Value: !Sub ${MisconfiguredWebServer.PublicIp}
    Description: Misconfigured Instance
</details>


<details><summary>How to use web tokens</summary>
<pre>
cat <<-EOF | deno run -Ar -
import { create, verify , getNumericDate, Payload, Header} from "https://deno.land/x/djwt@v2.4/mod.ts";

const encoder = new TextEncoder()
var keyBuf = encoder.encode("mySuperSecret");

var key = await crypto.subtle.importKey(
  "raw",
  keyBuf,
  {name: "HMAC", hash: "SHA-256"},
  true,
  ["sign", "verify"],
)

const payload: Payload = {
  iss: "deno-demo",
  exp: getNumericDate(300), // expires in 5 min.
};

const algorithm = "HS256"

const header: Header = {
  alg: algorithm,
  typ: "JWT",
  foo: "bar"  // custom header
};

const jwt = await create(header, payload, key)

console.log(jwt);

// create a different key to test the verifcation
/*keyBuf = encoder.encode("TheWrongSecret");
key = await crypto.subtle.importKey(
  "raw",
  keyBuf,
  {name: "HMAC", hash: "SHA-256"},
  true,
  ["sign", "verify"],
)
*/

try {
  const payload = await verify(jwt, key); 
    console.log("JWT is valid");
    console.log(payload);
}
catch(_e){
  const e:Error= _e;
  console.log(e.message);
}
EOF
</pre>
</details>
