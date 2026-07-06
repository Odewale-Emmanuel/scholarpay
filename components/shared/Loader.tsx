import { Spinner } from "@/components/ui/spinner";
type LoaderProps = {
  title?: string;
  message?: string;
};

export function Loader({ title, message }: LoaderProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <div className="text-center">
          <p className="font-medium">{title || "Authenticating..."}</p>
          <p className="text-sm text-muted-foreground">
            {message || "Please wait while we verify your session."}
          </p>
        </div>
      </div>
    </div>
  );
}
