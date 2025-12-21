import { Link } from "react-router-dom";
import { Twitter, MessageCircle, Github } from "lucide-react";
import logo from "@/assets/logo.png";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="Solsite" className="h-10 w-auto" />
              <span className="text-xl font-display font-bold">Solsite</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              The fastest way to launch professional meme coin websites on Solana. 
              No code required.
            </p>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground/50 cursor-not-allowed relative">
                    <Twitter className="w-5 h-5" />
                    <Badge variant="outline" className="absolute -top-2 -right-3 text-[8px] px-1 py-0 h-3 bg-muted">
                      Soon
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Coming Soon</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground/50 cursor-not-allowed relative">
                    <MessageCircle className="w-5 h-5" />
                    <Badge variant="outline" className="absolute -top-2 -right-3 text-[8px] px-1 py-0 h-3 bg-muted">
                      Soon
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Coming Soon</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground/50 cursor-not-allowed relative">
                    <Github className="w-5 h-5" />
                    <Badge variant="outline" className="absolute -top-2 -right-3 text-[8px] px-1 py-0 h-3 bg-muted">
                      Soon
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Coming Soon</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/templates" className="text-muted-foreground hover:text-primary transition-colors text-sm">Templates</Link></li>
              <li><Link to="/builder" className="text-muted-foreground hover:text-primary transition-colors text-sm">Builder</Link></li>
              <li><a href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Solsite. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Solsite provides website infrastructure only. We do not endorse any token or project.
          </p>
        </div>
      </div>
    </footer>
  );
};
