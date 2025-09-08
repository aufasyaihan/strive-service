import { Router } from "express";
import { login, register, me, getMembershipInfo, updateMembership } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, me);
router.get("/membership", authenticateToken, getMembershipInfo);
router.put("/membership", authenticateToken, updateMembership);

export default router;
