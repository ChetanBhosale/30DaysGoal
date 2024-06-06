"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "../Droptheme";
import { FaRegUser } from "react-icons/fa";
import { Modal } from "../../model/Modal";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Dropdown from "@/components/dropdown/Dropdown";
import ProfileContent from "@/components/dropdown/ProfileContent";
import { useLoadUserQuery } from "@/store/query/authApi";
import LoadingPage from "../custom/LoadingPage";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user } = useSelector((state: any) => state.auth);

  const { isLoading, data } = useLoadUserQuery({});
  const router = useRouter();

  let path = usePathname();

  console.log(path);

  return (
    <div className="flex shadow-sm w-full justify-between py-2 px-8 items-center">
      <h1
        onClick={() => router.push("/")}
        className="text-xl text-extrabold logo cursor-pointer  "
      >
        Gaol.ai
      </h1>
      <div className="flex gap-4 ">
        <ModeToggle />
        {!user && (
          <Modal>
            <Button variant="outline" size="sm" className="flex gap-2">
              <FaRegUser />
              account
            </Button>
          </Modal>
        )}
        {user && (
          <>
            <Button
              onClick={() => router.push("/dashboard")}
              variant={path.includes("/dashboard") ? "secondary" : "outline"}
              size="sm"
            >
              Dashboard
            </Button>
          </>
        )}
        {user && user !== null && user !== undefined && (
          <Dropdown Content={<ProfileContent />}>
            <Button size="sm" variant="outline" className=" uppercase">
              <Avatar>
                <AvatarFallback>
                  {/* <AvatarImage src={`https://api.dicebear.com/5.x/initials/svg?seed=${data?.user.email}`} /> */}
                  {isLoading ? (
                    <LoadingPage />
                  ) : (
                    <>
                      {data.user.email !== undefined &&
                        data.user.email.slice(0, 2)}{" "}
                    </>
                  )}
                  {}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Navbar;
