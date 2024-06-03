import { Button } from "@/components/ui/button";
import { ModeToggle } from "../Droptheme";
import { FaRegUser } from "react-icons/fa";
import { Modal } from "../../model/Modal";
const Navbar = () => {
  return (
    <div className="flex shadow-sm w-full justify-between py-4 bg-transparent px-6 items-center">
      <h3 className="text-xl font-bold tracking-wider">Gaol.Ai</h3>
      <div className="flex gap-4 ">
        <Modal>
          <Button variant="outline" size="sm" className="flex gap-2">
            <FaRegUser />
            account
          </Button>
        </Modal>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
