import React from "react";
import { Link } from "react-router-dom";
import FloatingShape from "../components/FloatingShape";

const Home = () => {
  return (
    <div
      className="bg-gradient-to-br min-h-screen
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden flex-col bg-[url('https://scontent.fisb5-1.fna.fbcdn.net/v/t39.30808-6/253172870_213559807567920_8182770041136030945_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeF3wwsKtxdO5uCV4z856oBFyn4WWwRROTrKfhZbBFE5Olrc858ROf4v4WXQ7j9x0J-aS2PSE33aZtp1GlRrVMM6&_nc_ohc=rveZeNBNsxoQ7kNvgHN7c00&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fisb5-1.fna&_nc_gid=AOuSkLmEZ4-h1xdN8VxgBsG&oh=00_AYDEtpNUGC0My_-_SjCq0cJnVA3nncRALdL1P9sXABvs0w&oe=67017E1E')] cover"
    >
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <h1 className="text-3xl font-bold mb-4">
        This is the online notice board
      </h1>
      <Link
        to="/login"
        className="mt-4 inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Click the button to login first
      </Link>
    </div>
  );
};

export default Home;
