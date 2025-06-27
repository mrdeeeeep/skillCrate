import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsDown, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ResourceTileProps {
  title: string;
  description: string;
  rating: number;
  icon: React.ReactNode;
  metadata: {
    author?: string;
    duration?: string;
    views?: number;
    likes?: number;
    pages?: number;
    language?: string;
    difficulty?: string;
    // Repository-specific fields
    full_name?: string;
    stars?: number;
    topics?: string;
  };
  url?: string;
}

export function ResourceTile({ title, description, rating, icon, metadata, url }: ResourceTileProps) {
  const [isDisliked, setIsDisliked] = useState(false);

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
  };

  // Custom card for repositories
  if (metadata.full_name) {
    return (
      <Card className="resource-tile group rounded-xl border-blue-400/40">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-gray-900 rounded-xl flex-shrink-0 w-24 h-24 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 flex items-center gap-2">
                  {title}
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" title="Open on GitHub">
                      <ExternalLink className="inline w-4 h-4 text-blue-500 hover:text-blue-600 ml-1" />
                    </a>
                  )}
                </h3>
                <div className="text-xs text-blue-400 mb-1">{metadata.full_name}</div>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-3">{description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {metadata.stars?.toLocaleString()} stars</span>
                  {metadata.language && <span className="px-2 py-0.5 bg-slate-700 rounded text-white">{metadata.language}</span>}
                  {metadata.topics && metadata.topics.length > 0 && (
                    <span className="flex flex-wrap gap-1">{metadata.topics.split(',').map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{t}</span>
                    ))}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">SkillCrate rating</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating}/10</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDislike}
                  className={`p-2 rounded-lg ${isDisliked ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default card for all other resource types
  return (
    <Card className="resource-tile group rounded-xl">
      <div className="flex items-start gap-4">
        <div className="p-4 skill-crate-gradient rounded-xl flex-shrink-0 w-24 h-24 flex items-center justify-center">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{description}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                {metadata.author && <span>By {metadata.author}</span>}
                {metadata.duration && <span>{metadata.duration}</span>}
                {metadata.views && <span>{metadata.views.toLocaleString()} views</span>}
                {metadata.likes && <span>{metadata.likes.toLocaleString()} likes</span>}
                {metadata.pages && <span>{metadata.pages} pages</span>}
                {metadata.language && <span>{metadata.language}</span>}
                {metadata.difficulty && (
                  <span className="px-2 py-1 bg-accent rounded-lg text-accent-foreground">
                    {metadata.difficulty}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating}/10</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDislike}
                  className={`p-2 rounded-lg ${isDisliked ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
                
                {url && (
                  <Button size="sm" variant="ghost" className="p-2 rounded-lg" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

