/*Через параметри запиту передають операцію (add, subtract, mult) і числа (розділені дефісами), 
які треба опрацювати. Знайти результат і повернути користувачу. Наприклад при запиті:
http://localhost:3000/add/12-4-23-45   - треба знайти суму чисел 12,4,23,45
*/
import { createServer } from "http"
import { parse } from "url"

// Функція для обчислень
const calculate = (operation, numbers) => {
  switch (operation) {
    case "add":
      return numbers.reduce((acc, num) => acc + num, 0)
    case "subtract":
      return numbers.reduce((acc, num) => acc - num)
    case "mult":
      return numbers.reduce((acc, num) => acc * num, 1)
    default:
      return "Unsupported operation"
  }
}

// Створюємо сервер
const server = createServer((req, res) => {
  // Розбираємо URL
  const { pathname } = parse(req.url, true)
  const parts = pathname.split("/").filter(Boolean) // Очищаємо пусті значення

  if (parts.length < 2) {
    res.writeHead(400, { "Content-Type": "text/plain" })
    res.end("Invalid request format")
    return
  }

  // Отримуємо операцію та числа
  const operation = parts[0]
  const numbers = parts[1].split("-").map(Number)

  if (numbers.some(isNaN)) {
    res.writeHead(400, { "Content-Type": "text/plain" })
    res.end("Invalid numbers")
    return
  }

  // Обчислюємо результат
  const result = calculate(operation, numbers)

  // Відправляємо результат користувачу
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end(`Result: ${result}`)
})

// Запускаємо сервер на порту 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/")
})
