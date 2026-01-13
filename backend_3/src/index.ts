import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import "./db/connnectToDb";
import helmet from "helmet";
import "dotenv/config";
import path from "path";

const app = express();
let port = process.env.PORT;

let frontendPath = path.join(process.cwd(), "../frontend/dist");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-booking-app-f0st.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; connect-src 'self' http://localhost:5173 http://localhost:4000"
//   );
//   next();
// });
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        connectSrc: [
          "'self'",
          "http://localhost:4000",
          "https://mern-booking-app-f0st.onrender.com",
          "https://api.stripe.com",
        ],

        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", "https://js.stripe.com"],

        frameSrc: ["'self'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// app.get("/",(req:Request , res : Response)=>{

//     res.json({
//         message:"hello world from pichu"
//     })
// })

// route
import userRouter from "./routes/user.route";
import hotelRouter from "./routes/my-hotel";
import searchHotelRouter from "./routes/search.hotel";

app.use("/api/v1/auth/", userRouter);
app.use("/api/v1/my-hotel", hotelRouter);
app.use("/api/v1/hotels", searchHotelRouter);

app.use(express.static(frontendPath));
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
