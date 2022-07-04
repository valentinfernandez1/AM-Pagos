import { Router } from "express";
import { NextFunction, Request, Response } from "express";

const router = Router();

//Define routes Here
router.get("/login", (req: Request, res: Response, next: NextFunction)=>{res.send("In login")})
router.get("/login/:id", (req: Request, res: Response, next: NextFunction)=>{res.send(`In login with id ${req.params.id}`)})


export default router;