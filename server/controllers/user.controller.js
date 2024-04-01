import { match } from "assert";
import userModel from "../models/user.model.js";
import * as faceapi from "face-api.js";
import jwt from "jsonwebtoken";

export const signupUser = async (req, res, next) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Max-Age", "1800");
		res.setHeader("Access-Control-Allow-Headers", "content-type");
		res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
        
        const { name, email, password, faceDimensions } = req.body;
        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist) {
            return res.status(400).json("Email already exists")
        }
        const user = await userModel.create({
            name,
            email,
            password,
            faceDimensions
        });
        res.status(200).send(user);
    } catch (error) {
        res.status(404).json(error.message);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Max-Age", "1800");
		res.setHeader("Access-Control-Allow-Headers", "content-type");
		res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");

        const { faceAIData, email, password } = req.body;
        // console.log(faceAIData);
        if (faceAIData.length > 0) {
            const users = await userModel.find();
            // console.log(users);
            const distanceThreshold = 0.5;
            let matchedUser;
            for (var i = 0; i < users.length; i++) {
                const distance = faceapi.euclideanDistance(users[i].faceDimensions, faceAIData);

                if (distance <= distanceThreshold) {
                    matchedUser = users[i];
                    console.log(distance);
                    break;
                }
            }
            if (matchedUser) {
                // console.log(matchedUser);
                return res.status(200).json(
                    matchedUser
                )
            }
            else {
                return res.status(400).json("Face is not matched");
            }
        }

        if (!email || !password) {
            return res.status(400).json("Please enter email or password")
        };
        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json("You are not registered");
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json("Invalid email or password");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json(error.message);
    }
}