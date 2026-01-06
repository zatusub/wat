export default function GreenFooter() {
  return (
    <footer className="py-8 text-center text-sm text-emerald-600 border-t border-emerald-100 mt-auto bg-emerald-50/50">
      &copy; {new Date().getFullYear()} wat!? project. All rights reserved.
    </footer>
  );
}
