import SignupForm from "@/app/_components/organisms/signup_form";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-background dark:text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-center px-16">
          <div className="max-w-xl">
            <span className="inline-flex text-xs font-medium uppercase tracking-[0.18em] text-secondary">
              Smart Water Purifier
            </span>

            <h1 className="mt-2 text-5xl font-semibold leading-tight tracking-tight">
              Start monitoring your water purification system with confidence.
            </h1>

            <p className="mt-4 text-base leading-7 text-muted">
              Buat akun untuk mengakses dashboard monitoring sensor, process
              cycles, dan AI decisions dalam satu platform yang modern dan rapi.
            </p>

          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-semibold">Create Account</h1>
              <p className="mt-2 text-sm text-muted">
                Smart Water Purifier Monitoring Dashboard
              </p>
            </div>

            <SignupForm />
          </div>
        </section>
      </div>
    </div>
  );
}

export default SignupPage;