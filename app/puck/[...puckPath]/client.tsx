"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import { createAiPlugin } from "@puckeditor/plugin-ai";
import config, { EditorModeProvider } from "@/puck/index";

const aiPlugin = createAiPlugin();

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <EditorModeProvider isEditor>
      <Puck
        config={config}
        data={data}
        onPublish={async (data) => {
          await fetch("/puck/api", {
            method: "post",
            body: JSON.stringify({ data, path }),
          });
        }}
        plugins={[aiPlugin]}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <a
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--puck-color-grey-05)",
                  background: "var(--puck-color-grey-11)",
                  border: "1px solid var(--puck-color-grey-09)",
                  borderRadius: "4px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Preview
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              {children}
            </>
          ),
        }}
      />
    </EditorModeProvider>
  );
}
