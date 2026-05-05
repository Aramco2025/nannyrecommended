import { useState } from "react";
import { useSavedSearches, useSaveSearch, useDeleteSavedSearch } from "@/hooks/useSavedSearches";
import { Bookmark, BookmarkPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SavedSearchesSheet({ currentFilters, onLoad }: { currentFilters: any; onLoad: (f: any) => void }) {
  const { data: searches = [] } = useSavedSearches();
  const save = useSaveSearch();
  const del = useDeleteSavedSearch();
  const [name, setName] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full"><Bookmark className="mr-1.5 h-3.5 w-3.5" />Saved searches{searches.length > 0 && <span className="ml-1.5 rounded-full bg-salmon px-1.5 text-[10px] font-bold text-pure-white">{searches.length}</span>}</Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px]">
        <SheetHeader><SheetTitle>Saved searches</SheetTitle></SheetHeader>

        <div className="mt-6 rounded-2xl border border-cream-deep p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-grey">Save current filters</div>
          <div className="mt-2 flex gap-2">
            <Input placeholder="e.g. Weekend evenings, JBR" value={name} onChange={(e) => setName(e.target.value)} />
            <Button
              size="sm"
              disabled={!name.trim() || save.isPending}
              onClick={() => { save.mutate({ name: name.trim(), filters: currentFilters }); setName(""); }}
              className="bg-salmon text-pure-white hover:bg-salmon-deep">
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-slate-grey">We'll alert you when new sitters match.</p>
        </div>

        <div className="mt-6 space-y-2">
          {searches.length === 0 ? (
            <p className="text-center text-sm text-slate-grey">No saved searches yet.</p>
          ) : searches.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-cream-deep bg-pure-white p-3">
              <button className="flex-1 text-left text-sm font-medium text-pitch-black hover:text-salmon-deep"
                onClick={() => onLoad(s.filters)}>{s.name}</button>
              <button onClick={() => del.mutate(s.id)} className="text-slate-grey hover:text-coral-red" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
