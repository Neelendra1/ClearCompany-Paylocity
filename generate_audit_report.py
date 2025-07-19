import os
import json
from pr_agent.cli import run

def generate_markdown_audit_report(pr_url, pr_number):
        review_result = run(f"--pr_url {pr_url} --command /review")
        review_data = json.loads(review_result)
        markdown_content = f"""
    # Audit Report for PR #{pr_number}
    ## Code Review
    ### Architecture
    {review_data.get('review', {}).get('architecture', 'No issues')}
    ### Code Quality
    {review_data.get('review', {}).get('code_quality', 'No issues')}
    ### Security
    {review_data.get('review', {}).get('security', 'No issues')}
    ### Performance
    {review_data.get('review', {}).get('performance', 'No issues')}
    ### Structure
    {review_data.get('review', {}).get('structure', 'No issues')}
    ## Labels
    {', '.join(review_data.get('labels', []))}
    """
        output_dir = "audit_reports"
        os.makedirs(output_dir, exist_ok=True)
        output_file = f"{output_dir}/PR_{pr_number}.md"
        with open(output_file, 'w') as f:
            f.write(markdown_content)
        return markdown_content
    
    if __name__ == "__main__":
        pr_url = os.getenv("PR_URL")
        pr_number = os.getenv("PR_NUMBER")
        generate_markdown_audit_report(pr_url, pr_number)