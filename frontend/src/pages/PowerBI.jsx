function PowerBI() {
  return (
    <div className="powerbi-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">BUSINESS INTELLIGENCE</p>
          <h1>Power BI Analytics</h1>
          <p>Interactive warehouse inventory intelligence and analytics.</p>
        </div>
      </div>

      <div className="powerbi-container">
        <iframe
          title="Warehouse_Inventory_Intelligence"
          width="1140"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=41b2684c-d98c-44c4-87ed-7d607ad0803e&autoAuth=true&ctid=bc88ed7e-984d-4728-939e-6ab8bfeaba1d"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default PowerBI