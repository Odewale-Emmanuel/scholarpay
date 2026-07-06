import { useRouter } from "next/navigation";

export function useNavigate() {
  const router = useRouter();

  function navigateTo(path: string) {
    router.push(path);
  }

  function goBack() {
    router.back();
  }

  return { navigateTo, goBack };
}
