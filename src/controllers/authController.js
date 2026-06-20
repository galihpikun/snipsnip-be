import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Belum diisi inputnya",
      });
    }

    const emailExists = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "email sudah terdaftar",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const user = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: hashedPw,
      },
    });

    return res.status(201).json({
      code: 201,
      success: true,
      message: "Berhasil register",
      data: {
        id: Number(user.id),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 400,
      message: "Belum diisi inputnya",
    });
  }
  try {
    const emailExists = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!emailExists) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Email or password is incorrect",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      emailExists.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Email or password is incorrect",
      });
    }
    const token = generateToken(
      {
        id: emailExists.id.toString(),
        email: emailExists.email,
        username: emailExists.username,
      },
      res,
    );

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Berhasil Login",
      data: {
        id: Number(emailExists.id),
        username: emailExists.username,
        email: emailExists.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({
    code: 200,
    success: true,
    message: "Berhasil logout",
  });
};

export const getMe = async (req,res) => {
    const userId = req.user.id;

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: Number(userId),
            },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "User tidak ditemukan",
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Berhasil mendapatkan data user",
            data: {
                id: Number(user.id),
                username: user.username,
                email: user.email,
                bio: user.bio
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
}

export const updateMe = async (req, res) => {
  const userId = req.user.id;

  const {username, email, bio} = req.body;

  if (!username || !email || !bio) {
    return res.status(400).json({
      code: 400,
      message: "Field harus diisi semua",
    });
  }

  try {
    const user = await prisma.users.update({
      where:{
        id: Number(userId),
      },
      data:{
        username: username,
        email: email,
        bio: bio,
      },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
      },
    })

    return res.status(200).json({
      code:200,
      success:true,
      message: "Berhasil update data user",
      data: user
    })
  } catch (error) {
    console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
  }
}
