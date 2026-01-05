"use client";

import { loginSchema } from "@/app/(components)/validators/loginSchema";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const result = loginSchema.safeParse(user);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(result.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value && value.length > 0) {
            fieldErrors[key] = value[0];
          }
        }
      );

      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log("login", data);

    redirect("/create-order");
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="max-w-md bg-white  mx-auto rounded-lg">
        <div className="flex justify-center items-center">
          <Image
            className="my-7"
            height={24}
            width={110}
            alt="Logo"
            src={"/logo.webp"}
          ></Image>
        </div>

        {/* top */}
        <div className="text-center">
          <h3 className="font-bold">
            Sign in to ShypBUDDY India Private Limited
          </h3>
          <p className="font-light text-gray-500 text-sm m-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <div className="mx-8 my-6">
          <div className="mb-3">
            <label htmlFor="" className="font-semibold text-sm">
              Email Address
            </label>
            <input
              type="Email"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
              placeholder="Enter Your Email Address"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="mb-7">
            <label htmlFor="" className="font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
              placeholder="Enter Your Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="mb-3">
            <button className="text-white bg-gray-800 hover:bg-gray-700 w-full p-1.5 rounded-md" onClick={handleSubmit}>
              Continue
            </button>
          </div>
        </div>
        <div className="text-center pb-8">
          <p className="text-gray-400 my-4">
            Don't have an account?
            <Link href={"/sign-up"}> Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
