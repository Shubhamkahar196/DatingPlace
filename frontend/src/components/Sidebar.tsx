import { MessageCircle, X } from "lucide-react";
import LoadingState from "./LoadingState";
import NoMatchesFound from "./NoMatchesFound";
import {Link} from 'react-router-dom'
import { useMatchStore } from "../store/useMatchStore";
import { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
}