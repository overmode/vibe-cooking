import { MascotIllustration } from "@/components/illustrations/mascot-illustration";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

export function EmptyAboutYou() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6 py-12">
      <div className="flex flex-col items-center space-y-3 text-center">
        <MascotIllustration
          expression="friendly"
          className="size-32 opacity-90"
          priority
        />
        <h3 className="max-w-md text-xl font-semibold">
          Let&apos;s get to know each other
        </h3>
      </div>

      <Button asChild>
        <Link href={routes.homeWithMessagePreset("about-you")}>
          Take the quiz
        </Link>
      </Button>
    </div>
  );
}
