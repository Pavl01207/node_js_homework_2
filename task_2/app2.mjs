/*Користувач через роут ‘/save_num/число’ може передати на сервер якесь число. 
Ці числа поступово треба зберігати у текстовому файлі numbers.txt. 
Наприклад, використовуючи такий роут:
http://localhost:3000/save_num/78  -  у файл треба додати число 78.
А використовуючи роути  ‘/sum’ – знайти суму, ‘mult’ –знайти добуток. 
За роутом «/remove» файл треба видалити.
*/
import http from "http"
import fs from "fs/promises"
import { parse } from "url"

const filePath = "numbers.txt" // Шлях до файлу, де зберігаються числа

// Функція для запису числа у файл (додаємо число до існуючих)
async function saveNumber(num) {
  try {
    // Якщо файл не існує, створюємо новий
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)
    if (!fileExists) {
      await fs.writeFile(filePath, num.toString(), "utf-8")
    } else {
      // Додаємо нове число з комою
      await fs.appendFile(filePath, `,${num}`, "utf-8")
    }
  } catch (err) {
    console.error("Error with writing number", err)
  }
}

// Функція для зчитування чисел з файлу
async function readNumbers() {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return data.split(",").map(Number)
  } catch (err) {
    console.error("Error on reading file", err)
    return []
  }
}

// Функція для видалення файлу
async function removeFile() {
  try {
    await fs.unlink(filePath)
  } catch (err) {
    console.error("Error with deleting file", err)
  }
}

// Створення серверу
const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true)
  const path = parsedUrl.pathname

  // Ігноруємо запит на favicon.ico
  if (path === "/favicon.ico") {
    res.writeHead(204, { "Content-Type": "image/x-icon" })
    res.end()
    return
  }

  // Маршрут для збереження числа
  if (path.startsWith("/save_num/")) {
    const numStr = path.split("/save_num/")[1]
    const num = parseInt(numStr, 10)

    if (isNaN(num)) {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("Incorected number")
    } else {
      // Записуємо число у файл
      await saveNumber(num)
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end(`Number ${num} writed in file`)
    }

    // Маршрут для знаходження суми чисел
  } else if (path === "/sum") {
    const numbers = await readNumbers()
    const sum = numbers.reduce((acc, num) => acc + num, 0)
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(`Summ: ${sum}`)

    // Маршрут для знаходження добутку чисел
  } else if (path === "/mult") {
    const numbers = await readNumbers()
    const product = numbers.reduce((acc, num) => acc * num, 1)
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end(`Mult: ${product}`)

    // Маршрут для видалення файлу
  } else if (path === "/remove") {
    await removeFile()
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Fail deleted.")

    // Якщо маршрут не знайдено
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Failed")
  }
})

// Запуск серверу
const port = 3000
server.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`)
})
