import { Op } from "sequelize";
import * as Yup from "yup";
import parseISO from "date-fns/parseISO";

import Customer from "../models/Customers";
import Contact from "../models/Contact"

const customers = [
  { id: 1, name: 'Dev Samurai', site: 'http://devsamurai.com.br' },
  { id: 2, name: 'Google', site: 'http://google.com.br' },
  { id: 3, name: 'Uol', site: 'http://uol.com.br' },
];

class CustomersControllers {
  // Listagem dos Customers
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query

    const page = req.query.page || 1
    const limit = req.query.limit || 25

    let where = {}
    let order = []

    if (name) {
      where = {
        ...where,
        name: {
          [Op.like]: name
        }
      }
    }
    if (email) {
      where = {
        ...where,
        email: {
          [Op.like]: email
        }
      }
    }
    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(',').map(item => item.toUpperCase())
        }
      }
    }
    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore)
        }
      }
    }
    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter)
        }
      }
    }
    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore)
        }
      }
    }
    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter)
        }
      }
    }
    console.log(where)
    if (sort) {
      order = sort.split(',').map(item => item.split(':'))
    }

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ['id', 'status']
        }
      ],
      order,
      limit,
      offset: limit * page - limit
    })
    return res.json(data);
  }

  // Recupera um Customer
  async show(req, res) {
    const customer = await Customer.findByPk(req.params.id)

    if (!customer) {
      return res.status(404).json()
    }
    return res.json(customer);
  }

  // Cria um Customer
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase()
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error on validate Schema' })
    }
    const customer = await Customer.create(req.body)
    return res.status(201).json(customer)
  }

  // Atualiza um Customer
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      status: Yup.string().uppercase()
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error on validate Schema' })
    }

    const customer = await Customer.findByPk(req.params.id)
    if (!customer) {
      return res.status(404).json
    }

    await customer.update(req.body)
    return res.json(customer)
  }



  // Exclui um Customer
  async destroy(req, res) {
    const customer = await Customer.findByPk(req.params.id)
    if (!customer) {
      return res.status(404).json
    }
    await customer.destroy()
    return res.json();
  }

}
export default new CustomersControllers();
