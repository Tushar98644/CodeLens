import Link from "next/link";

const LandingPage = () => {
  return (
    <div>
      sign in
      <Link href="/auth/sign-in">sign in</Link>
    </div>
  );
};

export default LandingPage;
