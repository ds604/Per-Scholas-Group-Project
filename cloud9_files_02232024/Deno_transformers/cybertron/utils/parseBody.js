export const parseBody = async (body) => {
    let tempBodyValue = {};
    if(body.type==="form"){
        let bodyValue = await body.value
        for (const [key, value] of bodyValue) {
            tempBodyValue[key] = value;
        }
    }
    // console.log("tempBodyValue: ", tempBodyValue)
    // console.log("body: ", body)
    // body.value = tempBodyValue;
    // return body;
    return {
        type: "form",
        value: tempBodyValue
    }
}