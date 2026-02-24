export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 py-8 mt-16">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-display font-bold text-primary mb-1">
              सुमिता न्यूज़ भोजपुरी
            </h3>
            <p className="text-sm text-muted-foreground">
              भोजपुरी समाचार और मनोरंजन का प्रामाणिक स्रोत
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <span className="text-destructive">♥</span>
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
