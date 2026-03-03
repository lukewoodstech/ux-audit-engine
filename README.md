This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

- **1. Install dependencies**

  ```bash
  pnpm install
  ```

- **2. Configure environment variables**

  Create a `.env.local` file (kept out of git via `.gitignore`) based on `.env.local.example`:

  - `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key.
  - `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (used only on the server side, never exposed to the browser).
  - `OPENAI_API_KEY` – OpenAI API key with access to a multimodal GPT-4o model.

- **3. Supabase database + storage**

  In Supabase:

  - Create the `audit-inputs` **private** storage bucket.
  - Apply the schema in `supabase/schema.sql` to create the `audits` and `audit_items` tables.
  - The API will store screenshot files at paths like `inputs/<audit-uuid>.<ext>` in the `audit-inputs` bucket and persist the path in the `audits.input_image_path` column.

- **4. Run the development server**

  ```bash
  pnpm dev
  ```

  Then open [http://localhost:3000](http://localhost:3000) to use the AI UX Audit Engine.

