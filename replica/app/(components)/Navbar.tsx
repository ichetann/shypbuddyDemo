import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 flex bg-black text-white h-16 justify-between z-50">
      {/* <div className="flex h-full "> */}
      {/* Left side */}
      <div className="flex justify-start m-3">
        <Link href={"/"}>
          <Image
            width={150}
            height={75}
            alt="Shypbuddy Logo"
            src={"/logo.webp"}
            className="flex justify-center items-center"
          />
        </Link>
      </div>
      {/* right side */}
      <div className="flex justify-end ">
        <div className="flex">
          <div className="flex justify-center items-center">
            <Link href={"/recharge"}>
              <button className="mr-4 px-3 bg-blue-400 rounded">
                Recharge
              </button>
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <Link href={"/orders"}>
              <button className="mr-4 px-3 bg-blue-400 rounded">
                Create Order
              </button>
            </Link>
          </div>
          <button className="mr-4">Create Order</button>
          <button className="mr-4">Create Order</button>
        </div>
      </div>
    </div>
    // </div>
  );
}
