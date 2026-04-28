import LoginForm from "@/app/_components/organisms/login_form";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background dark:text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-center px-16">
          <div className="max-w-xl">
            <span className="inline-flex text-xs font-medium uppercase tracking-[0.18em] text-secondary">
              Smart Water Purifier
            </span>
            <h1 className="mt-2 text-5xl font-semibold leading-tight tracking-tight">
              Monitor water purification with a clean and modern dashboard.
            </h1>

            <p className="mt-4 text-base leading-7 text-muted">
              Pantau sensor kualitas air, histori proses pemurnian, dan keputusan
              AI dalam satu sistem monitoring yang rapi dan mudah digunakan.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-semibold">Smart Water Purifier</h1>
              <p className="mt-2 text-sm text-muted">
                IoT Monitoring and AI Decision Dashboard
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;