import { Op } from 'sequelize'
import './database'

import Customer from './app/models/Customers'
import Contact from './app/models/Contact'

class Playground {
  static async play() {

    // const customer = await Customer.findByPk(3)

    // const customer = await Customer.findOne({
    //   attributes: { exclude: ['status'] }
    // })

    // const customers1 = await Customer.max('createdAt', {
    //   where: { status: 'ARCHIVED' }
    // })

    // console.log(JSON.stringify(customers1, null, 2))

    // const customers = await Customer.count({

    //   include: [{
    //     model: Contact,
    //     where: { //Optional
    //       status: 'ACTIVE'
    //     },
    //     required: false //Optional
    //   }],
    //   where: {
    //     [Op.or]: {
    //       status: {
    //         [Op.in]: ['ACTIVE', 'ARCHIVED']
    //       },
    // name: {
    //   [Op.like]: 'Mar%'
    // },
    // },
    // createdAt: {
    //   [Op.gte]: new Date()
    // }
    //   },
    //   order: [['name'], ['createdAt']],
    //   limit: 2,
    //   offset: 2 * 2 - 2, //limit * page - limit
    // })

    // const customers = await Customer.scope({ method: ['created', new Date(2023, 1, 1)] }).findAll()// usando escopo

    // const customers = await Customer.create({ //Insert
    //   name: 'Francalçados',
    //   email: 'francalcados@gmail.com'
    // })

    // const customers = await Customer.findByPk(1) //UPDATE
    // console.log('Antes', JSON.stringify(customers, null, 2))

    // const newCustomers = await customers.update({ status: 'ARCHIVED' })
    // console.log('Depois', JSON.stringify(newCustomers, null, 2))

    // const customers = await Customer.findByPk(4) //DELETE
    // customers.destroy()
    const customers = Customer.create({
      name: 'empresa 1',
      email: 'empresa1@email.com'
    })

    console.log(JSON.stringify(customers, null, 2))
  }
}

Playground.play() 