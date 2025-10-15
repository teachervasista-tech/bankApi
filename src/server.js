import bodyParser from "body-parser";
import { v4 } from "uuid";
import express from "express";
import db from "./database.js";

//const express = require(express);
//const bodyParser = require("body-parser");
//const { v4: uuidv4 } = require(uuid);

const app = express();
//const port = 3000;
app.use(bodyParser.json());

//Simulated database
let accounts = [];

function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

//Create new account
app.post("/accounts", (req, res) => {
  const { name, balance } = req.body;
  const id = generateId();
  if (!name || balance === undefined) {
    return res.status(400).json({ error: "Name and balance are required " });
  }
  const sql = "INSERT INTO accounts (id, name, balance) VALUES (?, ?, ?)";
  db.run(sql, [id, name, balance], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id, name, balance });
  });

  /* const newAccount = { id: generateId(), name, balance: Number(balance) };
  accounts.push(newAccount);
  res.status(201).json(newAccount); */
});

//Get all accounts
app.get("/accounts", (req, res) => {
  db.all("SELECT * FROM accounts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
  //res.json(accounts);
});

//Get single account
app.get("/accounts/:id", (req, res) => {
  const account = accounts.find((acc = acc.id === req.params.id));
  if (!account) return res.status(404).json({ error: "Account not found" });
  res.json(account);
});

// Deposit
app.post("/accounts/:id/deposit", (req, res) => {
  const { amount } = req.body;
  const account = accounts.find((acc = acc.id === req.params.id));
  if (!account) return res.status(404).json({ error: "Account not found" });
  if ((amount = 0))
    return res.status(400).json({ error: "Invalid deposit amount" });
  account.balance += Number(amount);
  res.json({ message: "Deposit successful", balance: account.balance });
});

//Withdraw
app.post("/accounts/:id/withdraw", (req, res) => {
  const { amount } = req.body;
  const account = accounts.find((acc = acc.id === req.params.id));
  if (!account) return res.status(404).json({ error: "Account not found" });
  if ((amount = 0 ? amount : account.balance))
    return res.status(400).json({ error: "Invalid withdrawal amount" });
  account.balance -= Number(amount);
  res.json({ message: "Withdrawal successful", balance: account.balance });
});

//Transfer
app.post("/accounts/:id/transfer", (req, res) => {
  const { fromId, toId, amount } = req.body;
  const fromAccount = accounts.find((acc = acc.id === fromId));
  const toAccount = accounts.find((acc = acc.id === toId));
  if (!fromAccount || !toAccount)
    return res.status(404).json({ error: "Account not found" });
  if ((amount = 0 || amount > fromAccount.balance))
    return res.status(400).json({ error: "Invalid transfer amount" });
  fromAccount.balance -= Number(amount);
  toAccount.balance += Number(amount);
  res.json({
    message: "Transfer successful",
    fromBalance: fromAccount.balance,
    toBalance: toAccount.balance,
  });
});

//Delete account
app.delete("/accounts/:id", (req, res) => {
  const index = accounts.findIndex((acc = acc.id === req.params.id));
  if (index === -1) return res.status(404).json({ error: "Account not found" });
  accounts.splice(index, 1);
  res.json({ message: "Account deleted successfully" });
});

/* app.listen(port, () => {
  console.log(`Banking Service running on httplocalhost${port}`);
}); */

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
