import pandas as pd
import numpy as np
from datetime import datetime

class SalesAnalytics:
    """
    Analyze sales trends and provide business insights
    """
    
    @staticmethod
    def analyze_trends(df):
        """
        Analyze overall sales trends
        """
        insights = {}
        
        # Check if we have date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() and 'year' in col.lower()]
        
        if date_cols and 'Total Revenue' in df.columns:
            year_col = [col for col in df.columns if 'year' in col.lower()][0]
            
            # Group by year
            yearly_sales = df.groupby(year_col)['Total Revenue'].agg(['sum', 'mean', 'count']).reset_index()
            yearly_sales.columns = ['year', 'total_revenue', 'avg_revenue', 'order_count']
            
            # Calculate year-over-year growth
            if len(yearly_sales) > 1:
                yearly_sales['yoy_growth'] = yearly_sales['total_revenue'].pct_change() * 100
                
                # Overall trend
                avg_growth = yearly_sales['yoy_growth'].mean()
                latest_growth = yearly_sales['yoy_growth'].iloc[-1] if not pd.isna(yearly_sales['yoy_growth'].iloc[-1]) else 0
                
                insights['trend'] = {
                    'status': 'increasing' if avg_growth > 0 else 'decreasing',
                    'avg_growth_rate': float(avg_growth) if not np.isnan(avg_growth) else 0,
                    'latest_growth_rate': float(latest_growth) if not np.isnan(latest_growth) else 0,
                    'yearly_data': yearly_sales.to_dict('records')
                }
        
        return insights
    
    @staticmethod
    def analyze_by_product(df):
        """
        Analyze sales by product/item type
        """
        insights = {}
        
        if 'Item Type' in df.columns and 'Total Revenue' in df.columns:
            product_sales = df.groupby('Item Type').agg({
                'Total Revenue': ['sum', 'mean', 'count'],
                'Total Profit': 'sum' if 'Total Profit' in df.columns else 'count',
                'Units Sold': 'sum' if 'Units Sold' in df.columns else 'count'
            }).reset_index()
            
            product_sales.columns = ['product', 'total_revenue', 'avg_revenue', 'order_count', 
                                    'total_profit', 'units_sold']
            
            # Sort by revenue
            product_sales = product_sales.sort_values('total_revenue', ascending=False)
            
            # Calculate contribution percentage
            total_rev = product_sales['total_revenue'].sum()
            product_sales['revenue_share'] = (product_sales['total_revenue'] / total_rev * 100)
            
            # Find top and bottom performers
            insights['top_products'] = product_sales.head(5).to_dict('records')
            insights['bottom_products'] = product_sales.tail(3).to_dict('records')
            insights['total_products'] = len(product_sales)
            
        return insights
    
    @staticmethod
    def analyze_by_region(df):
        """
        Analyze sales by region
        """
        insights = {}
        
        # Find region column
        region_col = None
        for col in df.columns:
            if 'region' in col.lower() and df[col].dtype == 'object':
                region_col = col
                break
        
        if region_col and 'Total Revenue' in df.columns:
            region_sales = df.groupby(region_col).agg({
                'Total Revenue': ['sum', 'mean', 'count']
            }).reset_index()
            
            region_sales.columns = ['region', 'total_revenue', 'avg_revenue', 'order_count']
            region_sales = region_sales.sort_values('total_revenue', ascending=False)
            
            # Calculate contribution
            total_rev = region_sales['total_revenue'].sum()
            region_sales['revenue_share'] = (region_sales['total_revenue'] / total_rev * 100)
            
            insights['region_performance'] = region_sales.to_dict('records')
            insights['best_region'] = region_sales.iloc[0].to_dict()
            insights['worst_region'] = region_sales.iloc[-1].to_dict()
            
        return insights
    
    @staticmethod
    def analyze_by_channel(df):
        """
        Analyze sales by channel (Online vs Offline)
        """
        insights = {}
        
        # Find sales channel column
        channel_col = None
        for col in df.columns:
            if 'channel' in col.lower() or 'sales channel' in col.lower():
                if df[col].dtype == 'object' or 'online' in str(df[col].unique()).lower():
                    channel_col = col
                    break
        
        if channel_col and 'Total Revenue' in df.columns:
            channel_sales = df.groupby(channel_col).agg({
                'Total Revenue': ['sum', 'mean', 'count']
            }).reset_index()
            
            channel_sales.columns = ['channel', 'total_revenue', 'avg_revenue', 'order_count']
            
            # Calculate share
            total_rev = channel_sales['total_revenue'].sum()
            channel_sales['revenue_share'] = (channel_sales['total_revenue'] / total_rev * 100)
            
            insights['channel_performance'] = channel_sales.to_dict('records')
            
        return insights
    
    @staticmethod
    def predict_future_trends(df, predictions):
        """
        Analyze predicted values to forecast future trends
        """
        insights = {}
        
        if 'Total Revenue' in df.columns and len(predictions) > 0:
            actual_avg = df['Total Revenue'].mean()
            predicted_avg = np.mean(predictions)
            
            # Compare actual vs predicted
            difference = predicted_avg - actual_avg
            pct_change = (difference / actual_avg * 100) if actual_avg != 0 else 0
            
            insights['forecast'] = {
                'current_avg_revenue': float(actual_avg),
                'predicted_avg_revenue': float(predicted_avg),
                'expected_change': float(difference),
                'expected_change_pct': float(pct_change),
                'outlook': 'positive' if pct_change > 0 else 'negative',
                'confidence': 'high' if abs(pct_change) > 5 else 'moderate'
            }
            
        return insights
    
    @staticmethod
    def get_recommendations(df, predictions):
        """
        Generate actionable business recommendations
        """
        recommendations = []
        
        # Product recommendations
        product_insights = SalesAnalytics.analyze_by_product(df)
        if 'top_products' in product_insights and len(product_insights['top_products']) > 0:
            top_product = product_insights['top_products'][0]
            recommendations.append({
                'type': 'product',
                'priority': 'high',
                'title': f"Focus on {top_product['product']}",
                'description': f"This is your best performer with ${top_product['total_revenue']:,.2f} in revenue ({top_product['revenue_share']:.1f}% of total sales).",
                'action': f"Increase inventory and marketing for {top_product['product']}"
            })
        
        # Region recommendations
        region_insights = SalesAnalytics.analyze_by_region(df)
        if 'best_region' in region_insights:
            best_region = region_insights['best_region']
            recommendations.append({
                'type': 'region',
                'priority': 'medium',
                'title': f"Expand in {best_region['region']}",
                'description': f"This region generates ${best_region['total_revenue']:,.2f} ({best_region['revenue_share']:.1f}% of total).",
                'action': f"Consider opening more distribution centers in {best_region['region']}"
            })
        
        if 'worst_region' in region_insights:
            worst_region = region_insights['worst_region']
            recommendations.append({
                'type': 'region',
                'priority': 'medium',
                'title': f"Improve {worst_region['region']} Performance",
                'description': f"This region underperforms with only ${worst_region['total_revenue']:,.2f} in revenue.",
                'action': f"Analyze market conditions and competition in {worst_region['region']}"
            })
        
        # Trend recommendations
        trend_insights = SalesAnalytics.analyze_trends(df)
        if 'trend' in trend_insights:
            if trend_insights['trend']['status'] == 'increasing':
                recommendations.append({
                    'type': 'trend',
                    'priority': 'high',
                    'title': "Positive Growth Momentum",
                    'description': f"Sales growing at {trend_insights['trend']['avg_growth_rate']:.1f}% year-over-year.",
                    'action': "Capitalize on growth by scaling operations and marketing"
                })
            else:
                recommendations.append({
                    'type': 'trend',
                    'priority': 'high',
                    'title': "Address Declining Sales",
                    'description': f"Sales declining at {abs(trend_insights['trend']['avg_growth_rate']):.1f}% year-over-year.",
                    'action': "Review pricing strategy, product mix, and market positioning"
                })
        
        # Prediction-based recommendations
        forecast = SalesAnalytics.predict_future_trends(df, predictions)
        if 'forecast' in forecast:
            if forecast['forecast']['outlook'] == 'positive':
                recommendations.append({
                    'type': 'forecast',
                    'priority': 'medium',
                    'title': "Prepare for Growth",
                    'description': f"Model predicts {forecast['forecast']['expected_change_pct']:.1f}% increase in revenue.",
                    'action': "Increase inventory and staffing to handle expected growth"
                })
            else:
                recommendations.append({
                    'type': 'forecast',
                    'priority': 'high',
                    'title': "Revenue Warning",
                    'description': f"Model predicts {abs(forecast['forecast']['expected_change_pct']):.1f}% decrease in revenue.",
                    'action': "Implement cost controls and explore new revenue streams"
                })
        
        return recommendations
    
    @staticmethod
    def generate_full_report(df, predictions):
        """
        Generate comprehensive analytics report
        """
        report = {
            'summary': {
                'total_records': len(df),
                'total_revenue': float(df['Total Revenue'].sum()) if 'Total Revenue' in df.columns else 0,
                'avg_order_value': float(df['Total Revenue'].mean()) if 'Total Revenue' in df.columns else 0,
            },
            'trends': SalesAnalytics.analyze_trends(df),
            'products': SalesAnalytics.analyze_by_product(df),
            'regions': SalesAnalytics.analyze_by_region(df),
            'channels': SalesAnalytics.analyze_by_channel(df),
            'forecast': SalesAnalytics.predict_future_trends(df, predictions),
            'recommendations': SalesAnalytics.get_recommendations(df, predictions)
        }
        
        return report