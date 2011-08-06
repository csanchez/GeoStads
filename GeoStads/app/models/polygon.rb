class Polygon < ActiveRecord::Base
  require 'rgeo/geo_json'
  # By default, use the GEOS implementation for spatial columns.
  self.rgeo_factory_generator = RGeo::Geos.method(:factory)

  # But use a geographic implementation for the :latlon column.
  set_rgeo_factory_for_column(:polygon, RGeo::Geographic.spherical_factory)
  
  def self.all_to_geoJson(conditions = nil)
    entity_factory = ::RGeo::GeoJSON::EntityFactory.instance
    features = []
    self.all(:conditions => conditions).each do |polygon|
      features.push(entity_factory.feature(polygon.polygon,polygon.id,{
        'name' => polygon.name,
        'html_color' => polygon.html_color}))
    end
    RGeo::GeoJSON.encode(entity_factory.feature_collection(features)).to_json
  end
 
end
