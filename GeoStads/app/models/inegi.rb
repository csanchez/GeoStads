class Inegi < ActiveRecord::Base
  #require 'rgeo/geo_json'
  # By default, use the GEOS implementation for spatial columns.
  self.rgeo_factory_generator = RGeo::Geos.method(:factory)

  # But use a geographic implementation for the :latlon column.
  set_rgeo_factory_for_column(:point, RGeo::Geographic.spherical_factory)
  
  
  def latitude
    self.point.y.to_f
  end

  def longitude
    self.point.x.to_f
  end

  def self.all_location_to_geoJson(conditions = nil)
    entity_factory = ::RGeo::GeoJSON::EntityFactory.instance
    features = []
    conditions = !conditions.nil? ?  [format_conditions(conditions),conditions] : nil 
    self.where(conditions).each do |inegi|
      features.push(entity_factory.feature(inegi.point,inegi.id,{
        'cve_ent' => inegi.cve_ent,
        'nom_ent' => inegi.nom_ent,
        'cve_mun' => inegi.cve_mun,
        'nom_mun' => inegi.nom_mun,
        'cve_loc' => inegi.cve_loc,
        'nom_loc' => inegi.nom_loc,
        'id'      => inegi.id.to_s+"_inegi",
        'class'   => "inegi_db_marker",
        'html_color' => "red"}))
    end
    RGeo::GeoJSON.encode(entity_factory.feature_collection(features)).to_json
  end


  def self.spatial_mean(attributes,conditions=nil)
    conditions = !conditions.nil? ?  [format_conditions(conditions),conditions] : nil
    inegis = self.where(conditions)
    entity_factory = ::RGeo::GeoJSON::EntityFactory.instance
    features = []
    attributes.each_key do |attr|
      spatial_mean_lat=0
      spatial_mean_lon=0
      sum=0;
      inegis.map{|inegi| 
        spatial_mean_lat += inegi[attr]*inegi.latitude
        spatial_mean_lon += inegi[attr]*inegi.longitude
        sum+=inegi[attr]
      }
      spatial_mean_lat /= sum
      spatial_mean_lon /= sum
      
      features.push(entity_factory.feature(RGeo::Geographic.spherical_factory(:srid => 4326).point(spatial_mean_lon,spatial_mean_lat),
          "spatial_mean_"+attr,{
          :class => "spatial_mean_"+attr,
          :html_color => "yellow",
          :id => "spatial_mean_"+attr,
          :description => "Media espacial de la variable "+ attr
         }))
      
    end
    RGeo::GeoJSON.encode(entity_factory.feature_collection(features))
  end
  
  def self.nearest_neighbor(conditions=nil)
    conditions = !conditions.nil? ?  [format_conditions(conditions),conditions] : nil
    inegis = self.where(conditions)
    entity_factory = ::RGeo::GeoJSON::EntityFactory.instance
    features = []
    prom_min=0;
    inegis.each do |inegi|
      min = inegi.find_minimum(inegis)
      prom_min +=min[:dist]
      features.push(entity_factory.feature(RGeo::Geographic.spherical_factory(:srid => 4326).line_string([min[:p_min].point,inegi.point]),
         "inegi_nearest_neighbor",
         {:distance =>min[:dist],
          :description => "Vecino mas cercano de la tabla INEGI",
          :id_p1 => inegi.id.to_s+"_inegi", 
          :id_p2 => min[:p_min].id.to_s+"_inegi" }))
    end
    prom_min /= features.size
    [entity_factory.feature_collection(features),prom_min]      
  end
  
  
  def self.moran(conditions=nil,grid_size,moran_attribute)
    conditions = !conditions.nil? ?  [format_conditions(conditions),conditions] : nil
    
    
    
    lon = -117.3;
    lat = 32.6;
    num_s_lon = (31/grid_size).to_i
    num_s_lat = (18/grid_size).to_i
    
    #calculamos la media de todos los cuadritos con el atributo especificado
    
    lon2 = lon+grid_size
    lat2 = lat+grid_size
    conditions[0] += " AND X(point) BETWEEN :x1 AND :x2 AND Y(point) BETWEEN :y1 AND :y2"
    conditions[1].merge!({:x1 => 0, :x2 => 0, :y1 => 0, :y2 =>0 })
    mean = 0 
    
    num_s_lat.times do |i|
      num_s_lon.times do |j|
        mean += mean(conditions,lon,lon2,lat,lat2,moran_attribute)
        lon = lon2
        lon2 = lon2+grid_size
      end
      lat = lat2
      lat2 = lat2+grid_size
    end
    mean /= num_s_lon*num_s_lat
    
    
    
     moran = 0
     moran_2 = 0 
     sum_wij = 0
     num_s_lon*num_s_lat.times do |sq|  
       #para el cuadro i
       mean_i = mean(conditions,lon, lon+grid_size, lat, lat+grid_size,moran_attribute);
       moran += (mean_i - mean)*(mean_i - mean)
       moran_2 = (mean_i - mean)*(mean_i - mean)
       sum_wij += 1
       #para el cuadro i-1 (orilla izq)
       if(sq % num_s_lon != 0 )
          moran += (mean_i - mean)*(mean(conditions,lon-grid_size, lon, lat, lat+grid_size,moran_attribute) - mean)
          sum_wij += 1
       end
       #para el cuadro i+1 (orilla der)
       if(sq % num_s_lon !=  num_s_lon - 1)
           moran += (mean_i - mean)*(mean(conditions,lon+grid_size,lon+grid_size*2, lat, lat+grid_size,moran_attribute) - mean)
           sum_wij += 1
        end
        #para el cuadro i-num_s_lon (orilla sup)
        if(i - num_s_lon > 0 )
          moran += (mean_i - mean)*(mean(conditions,lon, lon+grid_size, lat-grid_size, lat,moran_attribute) - mean)
          sum_wij += 1
        end
        #para el cuadro i-num_s_lon-1 (sup izq)
        if(sq % num_s_lon != 0 && sq % num_s_lon !=  num_s_lon - 1) 
          moran += (mean_i - mean)*(mean(conditions,lon-grid_size, lon, lat-grid_size, lat,moran_attribute) - mean)
          sum_wij += 1
        end
        #para el cuadro i-num_s_lon+1 (sup der)
        if(sq % num_s_lon !=  num_s_lon - 1 && sq - num_s_lon > 0 ) 
          moran += (mean_i - mean)*(mean(conditions,lon+grid_size, lon+grid_size*2, lat-grid_size, lat,moran_attribute) - mean)
          sum_wij += 1
        end
        #para el cuadro i+num_s_lon (orilla inf)
        if(sq + num_s_lon < num_s_lon*num_s_lat) 
          moran += (mean_i - mean)*(mean(conditions,lon, lon+grid_size, lat+grid_size, lat+grid_size*2,moran_attribute) - mean)
          sum_wij += 1
        end
        #para el cuadro i+num_s_lon-1 (inf izq)
        if(sq % num_s_lon != 0 && sq + num_s_lon < num_s_lon*num_s_lat) 
          moran += (mean_i - mean)*(mean(conditions,lon-grid_size, lon, lat+grid_size, lat+grid_size*2,moran_attribute) - mean)
          sum_wij += 1
        end
        #para el cuadro i+num_s_lon+1 (inf der)
        if(sq % num_s_lon !=  num_s_lon - 1 && sq + num_s_lon < num_s_lon*num_s_lat) 
          moran += (mean_i - mean)*(mean(conditions,lon+grid_size, lon+grid_size*2, lat+grid_size, lat+grid_size*2,moran_attribute) - mean)
          sum_wij += 1
        end
        lon += grid_size
        if(sq % num_s_lon == num_s_lon - 1 )
          lat -= grid_size
        end
     end
     
     # finalmente calculamos el coeficiente
     
     (num_s_lon*num_s_lat/sum_ij)*(moran/moran_2)
    
  end
  
  
  
  
  
  
  def self.attributes_to_json
    attributes=[]
    Inegi.column_names[8..31].each do |attr|
      attributes.push({:attribute => attr, :min => Inegi.minimum(attr),:max => Inegi.maximum(attr)})        
    end
    attributes.to_json
  end
  
  
  

  
  
  #Este metodo se encarga de encontrar el punto con la distancia minima al punto "inegi"  
  def find_minimum(inegis)
    min = Float::INFINITY   
    p_min = nil
    inegis.each do |inegi|  
      if(id != inegi.id &&  distance(inegi) < min)
        min = distance(inegi)
        p_min = inegi
      end
    end
    {:p_min => p_min, :dist => min}
  end
  
  def distance(inegi)
    point.distance(inegi.point)
  end


  private 
  
  def self.format_conditions(conditions)
    search = ""
    conditions.keys.each do |key|
      search+= " #{key} >= :#{key} AND "
    end
    search[0..search.length-5]
  end
  
  
  
    
    #Calcula la media del atributo especificado en moran_attribute, con las condiciones proporcionadas en conditions
    #dentro del rectangulo limitado por los puntos (lon,lon2), (lat,lat2)
    def mean(conditions,lon,lon2,lat,lat2,moran_attribute)
      conditions[1][:x1] = lon
      conditions[1][:x2] = lon2
      conditions[1][:y1] = lat
      conditions[1][:y2] = lat2  
      inegis = self.select(moran_attribute).where(conditions)
      mean = 0
      inegis.each do |inegi|
        mean += inegi[moran_attribute]
      end
      mean /= inegis.size
    end
    
    
    
  
  
  

end
