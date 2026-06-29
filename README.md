# `shadcn` Integration Reference

This application showcases how to integrate `shadcn` with Puck and Puck AI to build a page builder. It was bootstrapped with our [Next.js recipe](https://github.com/puckeditor/puck/tree/main/recipes/next), and all Puck component integration-related code lives under the `./puck` directory.

You can use it to:

- Get ready-to-use `shadcn` Puck component configs for your project
- Understand how to integrate your own components
- Bootstrap a new project from scratch

## Quick Start

### Using the `shadcn` Puck Component Configs

You're free to copy any components you need into your project however you like. Just make sure to bring in any required dependencies and update import paths based on where you paste the files.

Below are the steps for doing this while preserving the `./puck/` folder structure.

1. Clone this repository:
   ```sh
   git clone {link to repo}
   ```

2. [Install shadcn](https://ui.shadcn.com/docs/installation) in your project.

3. Set up a `@/puck` import alias in your `tsconfig.json`:  
   (You may need additional steps depending on your bundler)
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/puck*": ["./puck*"]
       }
     }
   }
   ```

4. Copy shared components, context, field configs, and utilities into your project:
   - `puck-configs/shadcn-twblocks/puck/components` → `your-project/puck/components`
   - `puck-configs/shadcn-twblocks/puck/context` → `your-project/puck/context`
   - `puck-configs/shadcn-twblocks/puck/lib` → `your-project/puck/lib`
   - `puck-configs/shadcn-twblocks/puck/config/fields` → `your-project/puck/config/fields`
   - `puck-configs/shadcn-twblocks/puck/config/types.ts` → `your-project/puck/config/types.ts`

5. Copy the `shadcn` components and hooks:
   - `puck-configs/shadcn-twblocks/components/ui` → `your-project/components/ui`
   - `puck-configs/shadcn-twblocks/hooks/` → `your-project/hooks`

6. Install `shadcn` dependencies:
   ```sh
   npm install @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-slot motion embla-carousel-react react-error-boundary
   ```

6. Copy any Puck component config you want to use:
   - Example: copying the Header component  
     `puck-configs/shadcn-twblocks/puck/config/components/header` → `your-project/puck/config/components/header`

7. Use it in your Puck config:
   ```tsx
   import { Puck } from "@measured/puck";
   import { EditorModeProvider } from "@/puck/context";
   import Header from "@/puck/config/components/header";

   const config = {
     components: {
       Header,
     },
   };

   const Editor = () => {
     return (
       <EditorModeProvider isEditor>
         <Puck data={{}} config={config} />
       </EditorModeProvider>
     );
   };
   ```

### Bootstrapping a New Project with `shadcn`

1. Clone this repository:
   ```sh
   git clone {link to repo}
   ```

2. [Install pnpm](https://pnpm.io/installation#using-npm)

3. Create a folder for your project.

4. Copy over all files from `puck-configs/shadcn-twblocks` into your project folder.

5. Update `package.json` with your own information:
   ```json
   {
     "name": "puck-configs", // Replace with your project name
     "version": "1.0.0" // Replace with your project version
     // ...rest of the package.json
   }
   ```

6. Install the project:
   ```sh
   pnpm install
   ```

7. Run it:
   ```sh
   pnpm dev
   ```
