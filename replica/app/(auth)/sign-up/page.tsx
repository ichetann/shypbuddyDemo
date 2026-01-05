"use client";
import { registerSchema } from "@/app/(components)/validators/registerSchema";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    console.log(user);
    const result = registerSchema.safeParse(user);

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

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log("Sucess", data);

    redirect("/sign-in")
    // save id in cookie or userId
  };
  return (
    <div className="bg-black">
      <div className="max-w-md bg-white  mx-auto h-screen rounded-2xl">
        <div className="flex justify-center items-center border-2 border-amber-500">
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
          <h3 className="font-semibold text-lg">Create your account</h3>
          <p className="font-light text-gray-500 text-sm">
            Welcome! Please fill in the details to get started
          </p>
        </div>

        {/* wrapper */}
        <div className="mx-8 my-6">
          <div className="flex flex-wrap gap-5">
            {/* top */}
            <div className="flex-1 mb-3">
              <label htmlFor="" className="font-normal text-sm">
                First Name
              </label>
              <input
                name="fname"
                onChange={changeHandler}
                type="text"
                className="w-full border border-gray-300 rounded-md px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
                placeholder="First Name"
              />
              {errors.fname && (
                <p className="text-red-500 text-xs">{errors.fname}</p>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="">Last Name</label>
              <input
                name="lname"
                onChange={changeHandler}
                type="text"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
                placeholder="Last Name"
              />
              {errors.lname && (
                <p className="text-red-500 text-xs">{errors.lname}</p>
              )}
            </div>
            {/* email */}
          </div>
          <div className="mb-3">
            <label htmlFor="">Email Address</label>
            <input
              name="email"
              onChange={changeHandler}
              type="Email"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
              placeholder="Enter Your Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="">Phone Number</label>
            <input
              name="mobileNo"
              onChange={changeHandler}
              type="text"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
              placeholder="Enter Your Phone Number"
            />
            {errors.mobileNo && (
              <p className="text-red-500 text-xs">{errors.mobileNo}</p>
            )}
          </div>
          <div className="mb-7">
            <label htmlFor="">Password</label>
            <input
              name="password"
              onChange={changeHandler}
              type="password"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 my-2 focus:border-4 focus:border-gray-300"
              placeholder="Enter Your Password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div className="flex items-center mb-3">
            <input type="checkbox" className="m-2" />
            <label htmlFor="" className=" text-sm">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <div className="mb-3">
            <button
              onClick={handleSubmit}
              className="text-white bg-gray-800 hover:bg-gray-700 w-full p-1.5 rounded-md"
            >
              Continue
            </button>
          </div>
        </div>
        {/* footer */}
        <div className="text-center ">
          <p className="text-gray-400 my-4">
            Already have an account?
            <Link href={"/sign-in"}> Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
