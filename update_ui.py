with open('apps/municipality/src/routes/_auth/tenders/$id.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{t('ui.contractor_id')}{bid.contractor_id}</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">{t('ui.bid_id')}{bid.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold tabular-nums text-[var(--primary)]">
                            ₹{(bid.quoted_amount ?? 0).toLocaleString("en-IN")}
                          </p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded border border-[var(--glass-border)]">{bid.status}</span>
                        </div>
                      </div>"""

replacement = """                      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg text-[var(--foreground)]">{bid.contractor?.company_name || 'Unknown Contractor'}</p>
                            {bid.contractor?.composite_score >= 4.0 && <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-emerald-500/20">Highly Rated</span>}
                          </div>
                          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">ID: {bid.contractor_id}</p>
                          
                          {/* Tri-Party Ratings */}
                          {bid.contractor && (
                             <div className="flex gap-3 mt-3">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Public</span>
                                  <span className="text-sm font-bold text-orange-500">{bid.contractor.public_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">AI Audit</span>
                                  <span className="text-sm font-bold text-blue-500">{bid.contractor.ai_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Officer</span>
                                  <span className="text-sm font-bold text-emerald-500">{bid.contractor.officer_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--primary)]">Composite</span>
                                  <span className="text-sm font-extrabold text-[var(--primary)]">{bid.contractor.composite_score || 'N/A'} / 5</span>
                               </div>
                             </div>
                          )}
                        </div>
                        <div className="text-right bg-[var(--surface-elevated)] p-3 rounded-xl border border-[var(--glass-border)]">
                          <p className="text-sm font-semibold text-[var(--muted-foreground)] uppercase">Quoted Bid</p>
                          <p className="text-2xl font-extrabold tabular-nums text-[var(--foreground)]">
                            ₹{(bid.quoted_amount ?? 0).toLocaleString("en-IN")}
                          </p>
                          <div className="mt-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--background)]">{bid.status}</span>
                          </div>
                        </div>
                      </div>"""

content = content.replace(target, replacement)
with open('apps/municipality/src/routes/_auth/tenders/$id.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
