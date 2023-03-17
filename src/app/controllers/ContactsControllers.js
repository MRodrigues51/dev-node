import { Op } from "sequelize";
import * as Yup from "yup";
import parseISO from "date-fns/parseISO";

import Customer from "../models/Customers";
import Contact from "../models/Contact"

class ContactsControllers {
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

    let where = { customer_id: req.params.customerId }
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

    const data = await Contact.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: ['id', 'status'],
          required: true
        }
      ],
      order,
      limit,
      offset: limit * page - limit
    })
    return res.json(data);
  }

  // Recupera um Contact
  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id
      },
      attributes: { exclude: ['customer_id', 'customerId'] }
      // include: [Customer]
    })

    if (!contact) {
      return res.status(404).json()
    }
    return res.json(contact);
  }

  // Cria um Contact
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase()
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error on validate Schema' })
    }
    const customer = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body
    })
    return res.status(201).json(customer)
  }

  // Atualiza um Contact
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      status: Yup.string().uppercase()
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error on validate Schema' })
    }

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id
      },
      attributes: { exclude: ['customer_id', 'customerId'] }
    })

    if (!contact) {
      return res.status(404).json
    }

    await contact.update(req.body)
    return res.json(contact)
  }



  // Exclui um Contact
  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_Id: req.params.customerId,
        id: req.params.id
      }
    })
    if (!contact) {
      return res.status(404).json
    }
    await contact.destroy()
    return res.json();
  }
}

export default new ContactsControllers