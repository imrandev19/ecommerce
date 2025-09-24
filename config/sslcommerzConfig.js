// sslcommerzConfig.js
module.exports = {
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWORD,
  is_live: false, // Set to true for live mode
  API_URL: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
  VALIDATION_URL: "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
};