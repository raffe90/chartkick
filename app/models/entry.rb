class Entry < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :charts

  def decode!
    {
      "date" => self.date.strftime("%b %Y").to_s,
      "value" => self.value,
      "symbol" => self.symbol,
      "id" => self.id
    }
  end

  def self.create_and_link(chart, entries)
    entries["date"].each do |i,v|
      if !entries["db_value"].nil? && entries["db_value"]["#{i}"] == "1"
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          @entry = Entry.find(entries["db_value"][symbol.parameterize.underscore]["#{i}"].to_i)
          @entry.update_attributes(value: entries[symbol.parameterize.underscore]["#{i}"].to_i, date: v.to_datetime)
          chart.entries << @entry
        end
      else
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          chart.entries.create({symbol: symbol.humanize.upcase, date: v.to_datetime,value: entries[symbol.parameterize.underscore]["#{i}"].to_i, chart_type: chart.type,  user_id: chart.user.id})
        end
      end
    end
  end

  def self.update_entries(entries)
    entries["date"].each do |i,v|
      entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
        Entry.find(entries["db_value"][symbol.parameterize.underscore]["#{i}"].to_i).update_attributes({date: v.to_datetime, value: entries[symbol.parameterize.underscore]["#{i}"].to_i})
      end
    end
  end

  def self.build(user_id, chart_type, limit_size = 5)
    entries = Array.new(limit_size) { Hash.new }
    klass = chart_type.safe_constantize
    klass.keys.each_with_index do |key, index|
      results = Entry.select("value, date, id").where(user_id: user_id).where(chart_type: chart_type).where(symbol: key).order('date DESC').limit(limit_size).reverse
      results.each_with_index do |result, i|
        entries[i].deep_merge!({key.parameterize('_').to_sym => result.value, :date => result.date.strftime("%Y-%m-%d").to_s, id: {}})
        entries[i][:id].deep_merge!({key.parameterize.underscore.to_sym => result.id})
      end
      if(results.size < limit_size)
        entries.delete_if{|i|i=={}}
      end
    end
    entries.first.blank? ? nil : entries
  end

  def self.build_session_params(user_id, chart_type, limit_size = 5)
    entries = {}
    # byebug
    klass = chart_type.safe_constantize
    klass.keys.each_with_index do |key, index|
      results = Entry.select("value, date").where(user_id: user_id).where(chart_type: chart_type).where(symbol: key).order('date DESC').limit(limit_size).reverse
      # byebug
      entries["date"] = Hash.new
      entries[key.parameterize('_').to_s] = Hash.new

      results.each_with_index do |result, i|

        entries["date"]["#{i+1}"] = result.date.strftime("%Y-%m-%d").to_s
        entries[key.parameterize('_').to_s]["#{i+1}"] = result.value.to_s
        # byebug
      end
      # byebug


    end
    # if(results.size < limit_size)
    #   entries.delete_if{|i|i=={}}
    # end
    # byebug
    # entries = self.parse_for_session(chart_type, entries)
    entries.first.blank? ? nil : entries
  end

  # def self.parse_for_session(entries)
  #   klass = chart_type.safe_constantize
  #   klass.keys.each_with_index do |key, index|

  #   end
  #   result =
  #   entries.each do |entry|

  #   end
  # end
end
