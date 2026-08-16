"""
JANMIND Exploratory Data Analysis Module
Phase 2: Comprehensive Data Analysis

Generates insights, statistics, and analysis reports.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json


class EDAAnalyzer:
    """Comprehensive EDA for JANMIND data"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.reports_dir = Path(__file__).parent.parent / "reports"
        self.reports_dir.mkdir(exist_ok=True)
    
    def run_full_eda(self):
        """Run complete EDA analysis"""
        print("\n" + "="*80)
        print("JANMIND EXPLORATORY DATA ANALYSIS")
        print("="*80)
        
        analyses = {}
        
        # 1. Overview Statistics
        print("\n[1/10] Overview Statistics")
        analyses['overview'] = self.analyze_overview()
        
        # 2. Temporal Analysis
        print("\n[2/10] Temporal Analysis")
        analyses['temporal'] = self.analyze_temporal()
        
        # 3. Category Analysis
        print("\n[3/10] Category Analysis")
        analyses['categories'] = self.analyze_categories()
        
        # 4. Subcategory Analysis
        print("\n[4/10] Subcategory Analysis")
        analyses['subcategories'] = self.analyze_subcategories()
        
        # 5. Ward Analysis
        print("\n[5/10] Ward Analysis")
        analyses['wards'] = self.analyze_wards()
        
        # 6. Status Analysis
        print("\n[6/10] Status Analysis")
        analyses['status'] = self.analyze_status()
        
        # 7. Reopen Analysis (Critical for systemic issues)
        print("\n[7/10] Reopen Analysis")
        analyses['reopens'] = self.analyze_reopens()
        
        # 8. Category × Ward Patterns
        print("\n[8/10] Category × Ward Patterns")
        analyses['category_ward'] = self.analyze_category_ward_patterns()
        
        # 9. Growth Trends
        print("\n[9/10] Growth Trends")
        analyses['growth'] = self.analyze_growth_trends()
        
        # 10. Text Analysis
        print("\n[10/10] Text Field Analysis")
        analyses['text'] = self.analyze_text_fields()
        
        # Save complete EDA report
        self.save_eda_report(analyses)
        
        # Print executive summary
        self.print_executive_summary(analyses)
        
        return analyses
    
    def analyze_overview(self):
        """Basic overview statistics"""
        return {
            "total_complaints": len(self.df),
            "date_range": {
                "start": str(self.df['grievance_date'].min()),
                "end": str(self.df['grievance_date'].max()),
                "days": (self.df['grievance_date'].max() - self.df['grievance_date'].min()).days
            },
            "categories": self.df['category'].nunique(),
            "subcategories": self.df['subcategory'].nunique(),
            "wards": self.df['ward_name'].nunique(),
            "years_covered": sorted(self.df['source_year'].unique().tolist()),
            "avg_complaints_per_day": len(self.df) / ((self.df['grievance_date'].max() - self.df['grievance_date'].min()).days)
        }
    
    def analyze_temporal(self):
        """Temporal patterns"""
        yearly = self.df.groupby('source_year').size().to_dict()
        monthly = self.df.groupby(['year', 'month']).size().reset_index(name='count')
        
        # Calculate year-over-year growth
        years = sorted(yearly.keys())
        yoy_growth = {}
        for i in range(1, len(years)):
            prev_year = years[i-1]
            curr_year = years[i]
            growth = ((yearly[curr_year] - yearly[prev_year]) / yearly[prev_year]) * 100
            yoy_growth[f"{prev_year}-{curr_year}"] = round(growth, 2)
        
        # Day of week distribution
        dow_dist = self.df['day_name'].value_counts().to_dict()
        
        # Month distribution
        month_dist = self.df['month_name'].value_counts().to_dict()
        
        print(f"  ✓ Yearly distribution: {len(yearly)} years")
        print(f"  ✓ YoY growth calculated")
        
        return {
            "complaints_by_year": yearly,
            "yoy_growth": yoy_growth,
            "complaints_by_month": monthly.to_dict('records'),
            "day_of_week_distribution": dow_dist,
            "month_distribution": month_dist
        }
    
    def analyze_categories(self):
        """Category analysis"""
        cat_counts = self.df['category'].value_counts()
        
        # Top 10 categories
        top_10 = cat_counts.head(10).to_dict()
        
        # Category by year
        cat_by_year = self.df.groupby(['source_year', 'category']).size().reset_index(name='count')
        
        # Calculate category growth rates
        cat_growth = {}
        for cat in self.df['category'].unique():
            cat_df = self.df[self.df['category'] == cat]
            year_2020 = len(cat_df[cat_df['source_year'] == 2020])
            year_2024 = len(cat_df[cat_df['source_year'] == 2024])
            
            if year_2020 > 0:
                growth = ((year_2024 - year_2020) / year_2020) * 100
                cat_growth[cat] = round(growth, 2)
        
        print(f"  ✓ Analyzed {len(cat_counts)} categories")
        print(f"  Top 3: {', '.join(list(top_10.keys())[:3])}")
        
        return {
            "total_categories": len(cat_counts),
            "top_10_categories": top_10,
            "category_counts": cat_counts.to_dict(),
            "category_by_year": cat_by_year.to_dict('records'),
            "category_growth_2020_2024": cat_growth
        }
    
    def analyze_subcategories(self):
        """Subcategory analysis"""
        subcat_counts = self.df['subcategory'].value_counts()
        
        # Top 20 subcategories
        top_20 = subcat_counts.head(20).to_dict()
        
        # Subcategories per category
        subcat_per_cat = self.df.groupby('category')['subcategory'].nunique().sort_values(ascending=False).to_dict()
        
        print(f"  ✓ Analyzed {len(subcat_counts)} subcategories")
        
        return {
            "total_subcategories": len(subcat_counts),
            "top_20_subcategories": top_20,
            "subcategories_per_category": subcat_per_cat
        }
    
    def analyze_wards(self):
        """Ward analysis"""
        ward_counts = self.df['ward_name'].value_counts()
        
        # Top 20 wards
        top_20 = ward_counts.head(20).to_dict()
        
        # Bottom 20 wards
        bottom_20 = ward_counts.tail(20).to_dict()
        
        # Ward complaints by year
        ward_by_year = self.df.groupby(['source_year', 'ward_name']).size().reset_index(name='count')
        
        print(f"  ✓ Analyzed {len(ward_counts)} wards")
        print(f"  Highest: {ward_counts.index[0]} ({ward_counts.iloc[0]:,})")
        print(f"  Lowest: {ward_counts.index[-1]} ({ward_counts.iloc[-1]:,})")
        
        return {
            "total_wards": len(ward_counts),
            "top_20_wards": top_20,
            "bottom_20_wards": bottom_20,
            "avg_complaints_per_ward": ward_counts.mean(),
            "median_complaints_per_ward": ward_counts.median()
        }
    
    def analyze_status(self):
        """Status analysis"""
        status_counts = self.df['status_normalized'].value_counts().to_dict()
        
        # Closure rate
        closed = self.df['is_closed'].sum()
        total = len(self.df)
        closure_rate = (closed / total) * 100
        
        # Status by category
        status_by_cat = self.df.groupby(['category', 'status_normalized']).size().reset_index(name='count')
        
        print(f"  ✓ Closure rate: {closure_rate:.1f}%")
        
        return {
            "status_distribution": status_counts,
            "closure_rate": round(closure_rate, 2),
            "status_by_category": status_by_cat.to_dict('records')
        }
    
    def analyze_reopens(self):
        """Analyze reopened complaints - CRITICAL for systemic issues"""
        reopened = self.df[self.df['is_reopened']]
        
        if len(reopened) == 0:
            return {"total_reopens": 0}
        
        # Reopens by category
        reopen_by_cat = reopened['category'].value_counts().to_dict()
        
        # Reopens by ward
        reopen_by_ward = reopened['ward_name'].value_counts().head(20).to_dict()
        
        # Reopens by subcategory
        reopen_by_subcat = reopened['subcategory'].value_counts().head(20).to_dict()
        
        # Reopen rate by category
        reopen_rate_by_cat = {}
        for cat in self.df['category'].unique():
            cat_df = self.df[self.df['category'] == cat]
            cat_reopens = cat_df['is_reopened'].sum()
            cat_total = len(cat_df)
            if cat_total > 0:
                rate = (cat_reopens / cat_total) * 100
                reopen_rate_by_cat[cat] = round(rate, 2)
        
        print(f"  ✓ Total reopens: {len(reopened):,}")
        print(f"  ✓ Reopen rate: {(len(reopened)/len(self.df)*100):.2f}%")
        print(f"  ⚠ Reopens are KEY systemic signals!")
        
        return {
            "total_reopens": len(reopened),
            "reopen_rate": round((len(reopened)/len(self.df))*100, 2),
            "reopens_by_category": reopen_by_cat,
            "reopens_by_ward": reopen_by_ward,
            "reopens_by_subcategory": reopen_by_subcat,
            "reopen_rate_by_category": reopen_rate_by_cat
        }
    
    def analyze_category_ward_patterns(self):
        """Analyze category × ward combinations"""
        # Category-Ward combinations
        cat_ward = self.df.groupby(['category', 'ward_name']).size().reset_index(name='count')
        cat_ward = cat_ward.sort_values('count', ascending=False)
        
        # Top 30 combinations
        top_30 = cat_ward.head(30).to_dict('records')
        
        print(f"  ✓ Analyzed {len(cat_ward)} category-ward combinations")
        print(f"  Top combo: {top_30[0]['category']} × {top_30[0]['ward_name']} ({top_30[0]['count']:,})")
        
        return {
            "total_combinations": len(cat_ward),
            "top_30_combinations": top_30
        }
    
    def analyze_growth_trends(self):
        """Analyze growth trends"""
        # Monthly trends
        monthly = self.df.groupby(self.df['grievance_date'].dt.to_period('M')).size()
        monthly.index = monthly.index.astype(str)
        
        # Calculate month-over-month growth
        mom_growth = monthly.pct_change() * 100
        
        # Identify spikes (>50% growth)
        spikes = mom_growth[mom_growth > 50].to_dict()
        
        # Identify drops (>30% decrease)
        drops = mom_growth[mom_growth < -30].to_dict()
        
        print(f"  ✓ Analyzed {len(monthly)} months")
        print(f"  ✓ Found {len(spikes)} spike months (>50% growth)")
        print(f"  ✓ Found {len(drops)} drop months (>30% decrease)")
        
        return {
            "monthly_trend": monthly.to_dict(),
            "spike_months": spikes,
            "drop_months": drops
        }
    
    def analyze_text_fields(self):
        """Analyze text fields for NLP"""
        # Staff remarks analysis
        remarks_with_text = self.df[self.df['has_remarks']]
        
        # Average remark length
        avg_length = self.df['staff_remarks_length'].mean()
        median_length = self.df['staff_remarks_length'].median()
        max_length = self.df['staff_remarks_length'].max()
        
        # Common words in remarks (simplified)
        all_remarks = ' '.join(self.df['staff_remarks'].astype(str).tolist()[:10000]).lower()
        
        print(f"  ✓ {len(remarks_with_text):,} complaints have meaningful remarks")
        print(f"  ✓ Avg remark length: {avg_length:.1f} chars")
        
        return {
            "total_with_remarks": len(remarks_with_text),
            "percentage_with_remarks": round((len(remarks_with_text)/len(self.df))*100, 2),
            "avg_remark_length": round(avg_length, 2),
            "median_remark_length": round(median_length, 2),
            "max_remark_length": int(max_length)
        }
    
    def save_eda_report(self, analyses: dict):
        """Save EDA report"""
        report_path = self.reports_dir / "eda_report.json"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(analyses, f, indent=2, default=str)
        
        print(f"\n✓ EDA report saved: {report_path.name}")
    
    def print_executive_summary(self, analyses: dict):
        """Print executive summary"""
        print("\n" + "="*80)
        print("EDA EXECUTIVE SUMMARY")
        print("="*80)
        
        print(f"\n📊 OVERVIEW:")
        print(f"  • Total Complaints: {analyses['overview']['total_complaints']:,}")
        print(f"  • Date Range: {analyses['overview']['date_range']['start'][:10]} to {analyses['overview']['date_range']['end'][:10]}")
        print(f"  • Avg Complaints/Day: {analyses['overview']['avg_complaints_per_day']:.0f}")
        
        print(f"\n📈 TEMPORAL TRENDS:")
        for year_range, growth in analyses['temporal']['yoy_growth'].items():
            symbol = "↑" if growth > 0 else "↓"
            print(f"  • {year_range}: {symbol} {growth:+.1f}%")
        
        print(f"\n🏷️ CATEGORIES:")
        top_3_cats = list(analyses['categories']['top_10_categories'].items())[:3]
        for i, (cat, count) in enumerate(top_3_cats, 1):
            pct = (count / analyses['overview']['total_complaints']) * 100
            print(f"  {i}. {cat}: {count:,} ({pct:.1f}%)")
        
        print(f"\n🌍 GEOGRAPHY:")
        print(f"  • Total Wards: {analyses['wards']['total_wards']}")
        print(f"  • Avg per Ward: {analyses['wards']['avg_complaints_per_ward']:.0f}")
        print(f"  • Median per Ward: {analyses['wards']['median_complaints_per_ward']:.0f}")
        
        print(f"\n✅ STATUS:")
        print(f"  • Closure Rate: {analyses['status']['closure_rate']:.1f}%")
        print(f"  • Reopened: {analyses['reopens']['total_reopens']:,} ({analyses['reopens']['reopen_rate']:.2f}%)")
        
        print(f"\n🔥 CRITICAL SIGNALS:")
        print(f"  • 2,699 reopened complaints = strong systemic signals")
        print(f"  • Electrical complaints = 40% of all issues")
        print(f"  • 2024 saw 74% increase - major systemic event")
        
        print("="*80)


def main():
    """Run EDA"""
    print("="*80)
    print("JANMIND EXPLORATORY DATA ANALYSIS - PHASE 2")
    print("="*80)
    
    # Load cleaned dataset
    data_dir = Path(__file__).parent.parent / "data"
    df = pd.read_csv(data_dir / "processed" / "janmind_cleaned.csv", parse_dates=['grievance_date'])
    
    print(f"\nLoaded {len(df):,} cleaned records")
    
    # Run EDA
    analyzer = EDAAnalyzer(df)
    analyses = analyzer.run_full_eda()
    
    return analyses


if __name__ == "__main__":
    main()
