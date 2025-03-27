import { Request, Response } from "express";
import UserModel from "src/model/user.model";
import { UserReqBody } from "src/types";
import { partialReqBody } from "src/types";

export default class UserController {
  static async create(
    req: Request<{}, {}, { data: UserReqBody }>,
    res: Response
  ) {
    const { data } = req.body;
    try {
      const createUser = await UserModel.create(data);
      res.status(201).json({ createUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    try {
      const getUser = await UserModel.getById(+id);

      res.status(200).json({ getUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const allUsers = await UserModel.get();
      res.status(200).json({ allUsers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async update(
    req: Request<{ id: string }, {}, { data: partialReqBody }>,
    res: Response
  ) {
    const id = req.params.id;
    const { data } = req.body;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({
        error: "Request body is empty or missing required data.",
      });
      return;
    }
    const whiteList = [
      "firstname",
      "lastname",
      "username",
      "password",
    ] as const;
    try {
      const whiteListPayload: partialReqBody = {};

      whiteList.forEach((fieldName) => {
        const value = data[fieldName];
        if (value) {
          whiteListPayload[fieldName] = value;
        }
      });

      console.log(whiteListPayload);
      const updatedUser = await UserModel.update(+id, whiteListPayload);
      res.status(200).json({ updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }
      const deletedUser = await UserModel.delete(+id);
      res.status(200).json({ deletedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}
