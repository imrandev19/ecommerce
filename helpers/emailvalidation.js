function emailValidation(email) {
    const emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    return emailCheck
}

module.exports = emailValidation