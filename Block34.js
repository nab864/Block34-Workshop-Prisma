
const { PrismaClient } = require("@prisma/client") 

const express = require("express")

const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(express.json())
app.use(require("morgan")("dev"))

app.get("/api/customers", async (req, res, next) => {
  try {
    const response = await prisma.customer.findMany()
    res.send(response)
  } catch (error) {
    next(error)
  }
})
app.get("/api/restaurants", async (req, res, next) => {
  try {
    const response = await prisma.restaurant.findMany()
    res.send(response)
  } catch (error) {
    next(error)
  }
})
app.get("/api/reservations", async (req, res, next) => {
  try {
    const response = await prisma.reservation.findMany()
    res.send(response)
  } catch (error) {
    next(error)
  }
})
app.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    const { customer_id} = req.params
    const { restaurant_id, party_count } = req.body
    const response = await prisma.reservation.create({
      data: {
        party_count: party_count,
        restaurant: {
          connect: {
            id: restaurant_id
          }
        },
        customer: {
          connect: {
            id: customer_id
          }
        }
      }
    })
    res.send(response)
  } catch (error) {
    next(error)
  }
})
app.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await prisma.reservation.delete({
      where: {
        id: id
      }
    })
    res.send(response)
  } catch (error) {
    next(error)
  }
})


const init = async () => {
  await prisma.reservation.deleteMany({})
  await prisma.customer.deleteMany({})
  await prisma.restaurant.deleteMany({})

  const customers = await prisma.customer.createManyAndReturn({
    data: [
      { name: "Kai"},
      { name: "Ryan"},
      { name: "Charbel"}
    ]
  })
  const restaurants = await prisma.restaurant.createManyAndReturn({
    data: [
      { name: "Taco Bell"},
      { name: "McDonalds"},
      { name: "Popeye's"}
    ]
  })
  const reservations = await prisma.reservation.create({
    data: {
      party_count: 20,
      restaurant:{
        connect: {
          id: restaurants[0].id
        }
      },
      customer:{
        connect: {
          id: customers[0].id
        }
      }
    }
  })

  app.listen(port, () => {
    console.log("Listening on Port 3000")
  })
}
init()