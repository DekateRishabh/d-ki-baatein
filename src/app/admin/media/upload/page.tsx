import Link from "next/link";
import { uploadMedia } from "@/lib/admin/media-actions";

export default function UploadMediaPage() {
  return (
    <section className="admin-content">
      <header className="archive-intro">
        <p className="section-label">Media library</p>
        <h1>Upload media</h1>
        <p>Files are stored in Supabase Storage and registered in the media library.</p>
      </header>
      <form action={uploadMedia} className="admin-form">
        <label>
          File
          <input
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,audio/wav,audio/ogg,application/pdf,.doc,.docx"
          />
        </label>
        <label>
          Alt text
          <input name="alt_text" />
        </label>
        <label>
          Caption
          <input name="caption" />
        </label>
        <label>
          <input name="is_public" type="checkbox" /> Public media
        </label>
        <div>
          <button type="submit">Upload file</button>
          <Link href="/admin/media">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
