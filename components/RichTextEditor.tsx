"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

type Props = {
    value: string;
    onChange: (html: string) => void;
    onUploadImage?: () => void;
};

export default function RichTextEditor({

    value,
    onChange,
    onUploadImage,
}: Props) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],

        content: value || "<p></p>",

        editorProps: {
            attributes: {
                class:
                    "min-h-[420px] rounded-b-xl bg-white px-5 py-5 outline-none focus:outline-none [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:mb-3 [&_h4]:mt-4 [&_h4]:text-xl [&_h4]:font-bold [&_p]:mb-4 [&_p]:leading-7",
            },
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },

        immediatelyRender: false,
    });

    useEffect(() => {
        if (!editor) return;

        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "<p></p>", {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    if (!editor) {
        return (
            <div className="rounded-xl border p-5 text-sm text-gray-500">
                Loading editor...
            </div>
        );
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter URL", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file || !editor) return;

        setImageUploading(true);

        const fileExt = file.name.split(".").pop();

        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

        const filePath = `rich-content/${fileName}`;

        const { error } = await supabase.storage
            .from("product-images")
            .upload(filePath, file);

        if (error) {
            alert(error.message);
            setImageUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

        editor
            .chain()
            .focus()
            .setImage({
                src: data.publicUrl,
                alt: file.name,
            })
            .run();

        setImageUploading(false);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 p-3">
                <select
                    value={
                        editor.isActive("heading", { level: 2 })
                            ? "h2"
                            : editor.isActive("heading", { level: 3 })
                                ? "h3"
                                : editor.isActive("heading", { level: 4 })
                                    ? "h4"
                                    : "p"
                    }
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value === "p") {
                            editor.chain().focus().setParagraph().run();
                        }

                        if (value === "h2") {
                            editor.chain().focus().setHeading({ level: 2 }).run();
                        }

                        if (value === "h3") {
                            editor.chain().focus().setHeading({ level: 3 }).run();
                        }

                        if (value === "h4") {
                            editor.chain().focus().setHeading({ level: 4 }).run();
                        }
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-bold ${editor.isActive("bold")
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white"
                        }`}
                >
                    B
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                    className={`rounded-lg border px-3 py-2 text-sm italic ${editor.isActive("italic")
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white"
                        }`}
                >
                    I
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`rounded-lg border px-3 py-2 text-sm ${editor.isActive("bulletList")
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white"
                        }`}
                >
                    • List
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`rounded-lg border px-3 py-2 text-sm ${editor.isActive("orderedList")
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white"
                        }`}
                >
                    1. List
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Left
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Center
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Right
                </button>

                <button
                    type="button"
                    onClick={addLink}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Link
                </button>

                <>
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={imageUploading}
                        className="rounded-lg border border-orange-500 bg-orange-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {imageUploading ? "Uploading..." : "Image"}
                    </button>

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().undo().run()
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Undo
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().redo().run()
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                    Redo
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}