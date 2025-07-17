const fs = require('fs').promises
const path = require('path')

class FileHandler {
  constructor(filename) {
    this.filePath = path.join(__dirname, '../data', filename)
    this.ensureDataDirectory()
  }

  async ensureDataDirectory() {
    const dataDir = path.dirname(this.filePath)
    try {
      await fs.access(dataDir)
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dataDir, { recursive: true })
      }
    }
  }

  async read() {
    try {
      await this.ensureDataDirectory()
      const data = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array and create file
        await this.write([])
        return []
      }
      throw error
    }
  }

  async write(data) {
    try {
      await this.ensureDataDirectory()
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error('Error writing file:', error)
      throw error
    }
  }

  async append(newItem) {
    const data = await this.read()
    const id = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) + 1 : 1
    
    const itemWithMetadata = {
      ...newItem,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    data.push(itemWithMetadata)
    await this.write(data)
    return itemWithMetadata
  }

  async update(id, updates) {
    const data = await this.read()
    const index = data.findIndex(item => item.id === parseInt(id))
    
    if (index === -1) {
      return null
    }
    
    data[index] = { 
      ...data[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    }
    
    await this.write(data)
    return data[index]
  }

  async delete(id) {
    const data = await this.read()
    const initialLength = data.length
    const filteredData = data.filter(item => item.id !== parseInt(id))
    
    if (filteredData.length === initialLength) {
      return false // Item not found
    }
    
    await this.write(filteredData)
    return true
  }

  async findById(id) {
    const data = await this.read()
    return data.find(item => item.id === parseInt(id)) || null
  }

  async search(query) {
    const data = await this.read()
    const searchTerm = query.toLowerCase()
    
    return data.filter(item => 
      item.title?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.tags?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm)
    )
  }
}

module.exports = FileHandler