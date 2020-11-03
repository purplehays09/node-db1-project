const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

const Accounts = {
    getAll(){
        return db('accounts')
    },
    getById(id){
        return db('accounts').where({ id })
    },
    create(account){
        return db('accounts').insert(account)
    },
    update(id, post) {
        return db('posts').where({ id }).update(post)
      },
    delete(id) {
    return db('posts').where({ id }).del()
    }
}

router.get('/',(req,res) => {
    Accounts.getAll()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(400).json({message:error.message})
    })
})

router.get('/:id', (req, res) => {
    Accounts.getById(req.params.id)
      .then(data => {
        // if empty dataset, do something different
        if (!data.length) {
          res.json({ message: 'no account with said id' })
        } else {
          res.status(200).json(data[0])
        }
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  });

  router.post('/', (req, res) => {
    Accounts.create(req.body)
      .then(([id]) => {
        return Posts.getById(id).first()
      })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  });

  router.put('/:id', async (req, res) => {
    try {
      await Accounts.update(req.params.id, req.body)
      const updatedAccount = await Accounts.getById(req.params.id).first()
      res.status(200).json(updatedAccount)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const deletedRowsNumber = await Accounts.delete(req.params.id)
      if (!deletedRowsNumber) {
        res.status(400).json({ message: 'no post with given id' })
      } else {
        res.status(200).json({ message: 'post deleted successfully' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  });