/*У консольний додаток передають через параметр пенсійний вік. 
Наприклад node app.mjs –-pension=65
Потім питаємо у терміналі користувача скільки йому років (використати “readline”) 
і кажемо чи він є пенсіонером.*/
//імпорт модулів
import readline from "readline"
import { argv } from "process"
// дані
const urlUserInfo = process.argv.slice(2)
// отримуємо вік
const args = new URLSearchParams(urlUserInfo.join("&"))
const userAge = args.get("--pension")
//створює інтрерфейс
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.question("How old are you?", (userAge) => {
  if (parseInt(userAge) >= 60) {
    console.log("You are pensioner!")
    rl.close()
  } else {
    console.log("You are not pensioner!")
    rl.close()
  }
})
