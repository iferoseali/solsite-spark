export const BuilderFormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Project Info Section */}
      <div className="space-y-4">
        <div className="h-6 w-32 rounded bg-muted" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-10 rounded bg-muted" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-24 rounded bg-muted" />
        </div>
      </div>
      
      {/* Logo Upload Section */}
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-32 rounded-xl border-2 border-dashed border-muted bg-muted/30" />
      </div>
      
      {/* Social Links Section */}
      <div className="space-y-4">
        <div className="h-6 w-28 rounded bg-muted" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
        ))}
      </div>
      
      {/* Sections Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-muted" />
          <div className="h-8 w-16 rounded bg-muted" />
        </div>
        
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-muted" />
              <div className="w-6 h-6 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="flex-1" />
              <div className="w-8 h-8 rounded bg-muted" />
              <div className="w-8 h-8 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Generate Button */}
      <div className="h-12 rounded-lg bg-muted" />
    </div>
  );
};
