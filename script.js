let inputSlider = document.querySelector("#passwordLength");
let lengthDisplay = document.querySelector("#lengthNumber");
let passwordDisplay = document.querySelector("#passwordDisplay");
let copyBtn = document.querySelector("#passwordCopy");
let copyMsg = document.querySelector("#passwordCopyMsg");
let uppercaseCheck = document.querySelector("#uppercase");
let lowercaseCheck = document.querySelector("#lowercase");
let numbersCheck = document.querySelector("#numbers");
let symbolsCheck = document.querySelector("#symbols");
let indicator = document.querySelector("#strengthIndicator");
let generateBtn = document.querySelector(".generateButton");
let allCheckBox = document.querySelectorAll("input[type=checkbox]");
let symbols = '`~!@#$%^&*()_+-=*/|{}[]?<>,.:;"';

let password = "";
let passwordLength = 9;
let checkCount = 0;
handleSlider();
setIndicator('#ccc')

// handleSlider fxn kaa kaam kewal itna hai kii woo password length koo UI par display karwayega
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

// ye niche walla code slider kee movement ko handle karega kii total slider mee kitne slider kaa color change hogaa aur kitna nahii
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+'% 100%'
}

// setIndicator fxn kaa kaam kewal itna hai kii woo password kii strength ko UI par different colors mee display karwata hai
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min); //random fxn 0 se 1 kee beech number generate karega aur usee (max-min) see multiply kar dee to range 0 see max hogii par jaab min add kar denge too range min se max tak kii hogii
}

// Number walle checkbox kee liye ek random integer generate karta hai
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// lowercase walle checkbox kee liye ek random lowercase char generate karta hai
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
  // 'a' kii ascii value 97 aur 'z' kii ascii value 123 hotii hai aur humme inkee beech kaa koi char chahiyee
  // '.fromCharCode()' given number koo uskii ascii value mee convert karta hai
}

// uppercase walle checkbox kee liye ek random uppercase char generate karta hai
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
  // 'A' kii ascii value 65 aur 'Z' kii ascii value 91 hotii hai aur humme inkee beech kaa koi char chahiyee
}

// symbol walle checkbox kee liye ek random symbol char generate karta hai
function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if ((hasUpper + hasLower + hasNum + hasSym >= 3) && passwordLength >= 7)
    setIndicator("#0f0");
  else if ((hasUpper + hasLower + hasNum + hasSym >= 2) && passwordLength >= 5)
    setIndicator("#ff0");
  else setIndicator("#f00");
}0

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // shuffle the password array by swapping j with i, because of random method everytime jth index is different
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider(); //ui mee joo change visible hoga wo yee fxn sambhal legaa
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  // when none of the checkbox is ticked
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // agar koi password present hai too new password generate karne see phele usse remove karna padega
  password = "";

  // phele dekhenge kii konse checkboxes checked hai uskke according ek baar to wo char/num/symbol insert kar denge aur phir bakki bachi length mee kuch bhi insert kar sakte hai
  let fxnArr = [];
  if (uppercaseCheck.checked) fxnArr.push(generateUpperCase);
  if (lowercaseCheck.checked) fxnArr.push(generateLowerCase);
  if (numbersCheck.checked) fxnArr.push(generateRandomNumber);
  if (symbolsCheck.checked) fxnArr.push(generateSymbols);

  //compulsory password
  for (let i = 0; i < fxnArr.length; i++) {
    password += fxnArr[i]();

    // fxnArr() --> Invokes the function
    // fxnArr[i]--> access the element stored in array at index i.
    // fxnArr[i]() --> Invokes the function stored in array at index i.
  }

  // remaining password
  for (let i = 0; i < passwordLength - fxnArr.length; i++) {
    let randIndex = getRndInteger(0, fxnArr.length);
    password = password + fxnArr[randIndex]();
  }

  // Shuffle Password
  password = shufflePassword(Array.from(password));

  // show password in PasswordBox(in UI)
  passwordDisplay.value = password;

  // calculate strength of password
  calcStrength();
});
